import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Event, CalendarEvent } from "../types";
import api from "../services/api";
import { useAuth } from "./AuthContext";

interface CalendarContextType {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => void;
  refreshKey: number;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const fetchEvents = useCallback(
    async (showLoading = false): Promise<void> => {
      if (!isAuthenticated) {
        setEvents([]);
        setLoading(false);
        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        }
        setError(null);
        const response = await api.get<Event[]>("/events");

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

        // Create new Date objects to ensure they are different references
        const newEvents = calendarEvents.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        // Always update with new reference to force re-render
        // Use functional update to ensure we're working with latest state
        setEvents(() => newEvents);

        // Increment refresh key to force calendar update
        setRefreshKey((prev) => prev + 1);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch events");
        setEvents([]);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated]
  );

  // Refetch without showing loading
  const refetch = useCallback(async (): Promise<void> => {
    await fetchEvents(false);
  }, [fetchEvents]);

  // Force refresh by incrementing key and refetching
  const refresh = useCallback((): void => {
    setRefreshKey((prev) => prev + 1);
    refetch();
  }, [refetch]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents(true);
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [isAuthenticated, fetchEvents]);

  const value: CalendarContextType = {
    events,
    loading,
    error,
    refetch,
    refresh,
    refreshKey,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
