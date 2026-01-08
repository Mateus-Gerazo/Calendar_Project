import { useState, useEffect, useCallback } from 'react';
import { Event, CalendarEvent } from '../types';
import api from '../services/api';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (showLoading = false): Promise<void> => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const response = await api.get<Event[]>('/events');
      
      const calendarEvents: CalendarEvent[] = response.data.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description || undefined,
        contacts: event.contacts || undefined,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        resource: {
          user_id: event.user_id,
          created_at: event.created_at,
        },
      }));

      // Force state update by creating a completely new array reference
      // This ensures React detects the change and re-renders the calendar
      // Create new Date objects to ensure they are different references
      const newEvents = calendarEvents.map(e => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      }));
      
      // Always update with new reference, even if data seems the same
      setEvents(newEvents);
      
      // Force a second update after a microtask to ensure React processes it
      setTimeout(() => {
        setEvents(prev => {
          // Compare by IDs to see if we need to update
          const prevIds = prev.map(e => e.id).sort().join(',');
          const newIds = newEvents.map(e => e.id).sort().join(',');
          if (prevIds !== newIds) {
            return newEvents.map(e => ({
              ...e,
              start: new Date(e.start),
              end: new Date(e.end),
            }));
          }
          // Force update anyway by creating new array
          return [...newEvents];
        });
      }, 0);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch events');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchEvents(true); // Show loading on initial fetch
  }, [fetchEvents]);

  // Wrapper for refetch that doesn't show loading
  const refetchWithoutLoading = useCallback(async (): Promise<void> => {
    await fetchEvents(false);
  }, [fetchEvents]);

  return { events, loading, error, refetch: refetchWithoutLoading };
};
