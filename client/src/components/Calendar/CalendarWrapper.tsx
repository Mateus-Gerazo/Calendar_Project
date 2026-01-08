import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, SlotInfo, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '../../types';
import { EventModal } from '../Modals/EventModal';
import { useCalendar } from '../../context/CalendarContext';

// Create moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface CalendarWrapperProps {
  events: CalendarEvent[];
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({ events }) => {
  const { refreshKey } = useCalendar();
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(events);

  // Update local events when props change - force deep copy
  useEffect(() => {
    // Create a deep copy to ensure React detects the change
    const newEvents = events.map(e => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }));
    
    // Always update with new reference
    setLocalEvents(newEvents);
  }, [events, refreshKey]);

  // Create a key based on events to force re-render when events change
  // This key will change whenever events or refreshKey changes, forcing Calendar to remount
  const eventsKey = useMemo(() => {
    if (localEvents.length === 0) return `empty-${refreshKey}`;
    // Create a unique key based on event IDs, timestamps, and refresh key
    const ids = localEvents.map(e => e.id).sort().join('-');
    const timestamps = localEvents.map(e => `${e.start.getTime()}-${e.end.getTime()}`).join('-');
    const titles = localEvents.map(e => e.title).join('-');
    // Include refreshKey to ensure uniqueness and force remount
    return `calendar-${localEvents.length}-${ids}-${timestamps}-${titles}-${refreshKey}`;
  }, [localEvents, refreshKey]);

  const handleSelectSlot = (slotInfo: SlotInfo): void => {
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setSelectedEvent(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent): void => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  };

  return (
    <div className="h-[600px] bg-white rounded-lg shadow p-4">
      <Calendar
        key={eventsKey}
        localizer={localizer}
        events={localEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
      />
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          initialStart={selectedSlot?.start}
          initialEnd={selectedSlot?.end}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};
