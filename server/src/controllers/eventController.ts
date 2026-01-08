import { Request, Response } from 'express';
import pool from '../config/db';
import { Event, CreateEventDto, UpdateEventDto } from '../types';

export const getEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY start_date ASC',
      [userId]
    );

    const events: Event[] = result.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      contacts: row.contacts,
      start_date: new Date(row.start_date),
      end_date: new Date(row.end_date),
      created_at: new Date(row.created_at),
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description, contacts, start_date, end_date }: CreateEventDto =
      req.body;

    // Validation
    if (!title || !start_date || !end_date) {
      res.status(400).json({
        error: 'Title, start_date, and end_date are required',
      });
      return;
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    if (startDate >= endDate) {
      res.status(400).json({
        error: 'start_date must be before end_date',
      });
      return;
    }

    // Insert event
    const result = await pool.query(
      'INSERT INTO events (user_id, title, description, contacts, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, title, description || null, contacts || null, startDate, endDate]
    );

    const event: Event = {
      id: result.rows[0].id,
      user_id: result.rows[0].user_id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      contacts: result.rows[0].contacts,
      start_date: new Date(result.rows[0].start_date),
      end_date: new Date(result.rows[0].end_date),
      created_at: new Date(result.rows[0].created_at),
    };

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
      res.status(400).json({ error: 'Invalid event ID' });
      return;
    }

    const { title, description, contacts, start_date, end_date }: UpdateEventDto =
      req.body;

    // Check if event exists and belongs to user
    const existingEvent = await pool.query(
      'SELECT * FROM events WHERE id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existingEvent.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title !== undefined && title !== null) {
      const trimmedTitle = String(title).trim();
      if (trimmedTitle.length === 0) {
        res.status(400).json({ error: 'Title cannot be empty' });
        return;
      }
      updates.push(`title = $${paramIndex++}`);
      values.push(trimmedTitle);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      // Convert empty string to null, otherwise use the value
      values.push(description === null || description === '' ? null : String(description).trim());
    }

    if (contacts !== undefined) {
      updates.push(`contacts = $${paramIndex++}`);
      // Convert empty string to null, otherwise use the value
      values.push(contacts === null || contacts === '' ? null : String(contacts).trim());
    }

    if (start_date !== undefined && start_date !== null) {
      const startDate = new Date(start_date);
      if (isNaN(startDate.getTime())) {
        res.status(400).json({ error: 'Invalid start_date format' });
        return;
      }
      updates.push(`start_date = $${paramIndex++}`);
      values.push(startDate);
    }

    if (end_date !== undefined && end_date !== null) {
      const endDate = new Date(end_date);
      if (isNaN(endDate.getTime())) {
        res.status(400).json({ error: 'Invalid end_date format' });
        return;
      }
      updates.push(`end_date = $${paramIndex++}`);
      values.push(endDate);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    // Validate date order if both dates are being updated
    const finalStartDate =
      start_date !== undefined
        ? new Date(start_date)
        : new Date(existingEvent.rows[0].start_date);
    const finalEndDate =
      end_date !== undefined
        ? new Date(end_date)
        : new Date(existingEvent.rows[0].end_date);

    if (finalStartDate >= finalEndDate) {
      res.status(400).json({
        error: 'start_date must be before end_date',
      });
      return;
    }

    // Update event
    values.push(eventId, userId);
    const whereIdIndex = paramIndex;
    const whereUserIdIndex = paramIndex + 1;
    
    const query = `UPDATE events SET ${updates.join(', ')} WHERE id = $${whereIdIndex} AND user_id = $${whereUserIdIndex} RETURNING *`;
    
    console.log('Update query:', query);
    console.log('Update values:', values);
    console.log('Event ID:', eventId, 'User ID:', userId);
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found or update failed' });
      return;
    }
    
    console.log('Updated event:', result.rows[0]);

    const event: Event = {
      id: result.rows[0].id,
      user_id: result.rows[0].user_id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      contacts: result.rows[0].contacts,
      start_date: new Date(result.rows[0].start_date),
      end_date: new Date(result.rows[0].end_date),
      created_at: new Date(result.rows[0].created_at),
    };

    res.status(200).json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
      res.status(400).json({ error: 'Invalid event ID' });
      return;
    }

    // Check if event exists and belongs to user
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING id',
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
