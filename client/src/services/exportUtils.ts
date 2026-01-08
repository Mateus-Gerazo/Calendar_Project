import { Event } from '../types';
import { toGoogleCalendarFormat } from '../utils/dateHelpers';

export const generateICS = (event: Event): string => {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Personal Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@calendar-app`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
    event.contacts ? `ATTENDEE:${event.contacts}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter((line) => line !== '')
    .join('\r\n');

  return icsContent;
};

export const downloadICS = (event: Event): void => {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateCSV = (events: Event[]): string => {
  const headers = ['Title', 'Description', 'Contacts', 'Start Date', 'End Date'];
  const rows = events.map((event) => {
    return [
      event.title,
      event.description || '',
      event.contacts || '',
      new Date(event.start_date).toISOString(),
      new Date(event.end_date).toISOString(),
    ].map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',');
  });

  return [headers.map((h) => `"${h}"`).join(','), ...rows].join('\n');
};

export const downloadCSV = (events: Event[]): void => {
  const csvContent = generateCSV(events);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `calendar_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateGoogleCalendarLink = (event: Event): string => {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  const startStr = toGoogleCalendarFormat(startDate);
  const endStr = toGoogleCalendarFormat(endDate);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startStr}/${endStr}`,
    details: event.description || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
