import { format, parseISO } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'PPp'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};

export const parseISOString = (isoString: string): Date => {
  return parseISO(isoString);
};

// Convert to UTC basic string format for Google Calendar (YYYYMMDDThhmmssZ)
export const toGoogleCalendarFormat = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};
