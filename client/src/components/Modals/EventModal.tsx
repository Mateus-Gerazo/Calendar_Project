import React, { useState, useEffect, FormEvent } from "react";
import { CalendarEvent, CreateEventDto, UpdateEventDto } from "../../types";
import api from "../../services/api";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import {
  downloadICS,
  generateGoogleCalendarLink,
} from "../../services/exportUtils";
import { useCalendar } from "../../context/CalendarContext";
import { FiX, FiTrash2, FiDownload, FiCalendar } from "react-icons/fi";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  initialStart?: Date;
  initialEnd?: Date;
  isEditMode: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  initialStart,
  initialEnd,
  isEditMode,
}) => {
  const { refetch } = useCalendar();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contacts, setContacts] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && event) {
        setTitle(event.title);
        setDescription(event.description || "");
        setContacts(event.contacts || "");
        setStartDate(event.start.toISOString().slice(0, 16));
        setEndDate(event.end.toISOString().slice(0, 16));
      } else if (initialStart && initialEnd) {
        setTitle("");
        setDescription("");
        setContacts("");
        setStartDate(initialStart.toISOString().slice(0, 16));
        setEndDate(initialEnd.toISOString().slice(0, 16));
      }
      setError("");
    }
  }, [isOpen, isEditMode, event, initialStart, initialEnd]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const startISO = new Date(startDate).toISOString();
      const endISO = new Date(endDate).toISOString();

      if (isEditMode && event) {
        const updateData: UpdateEventDto = {
          title: title.trim(),
          description: description.trim() || undefined,
          contacts: contacts.trim() || undefined,
          start_date: startISO,
          end_date: endISO,
        };

        await api.put(`/events/${event.id}`, updateData);
      } else {
        const createData: CreateEventDto = {
          title,
          description: description || undefined,
          contacts: contacts || undefined,
          start_date: startISO,
          end_date: endISO,
        };
        await api.post("/events", createData);
      }

      // Close modal first for better UX
      onClose();

      // Refetch events from context to update calendar
      // This will automatically update the context state and trigger re-render
      await refetch();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!event || !isEditMode) return;

    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/events/${event.id}`);

      // Close modal first for better UX
      onClose();

      // Refetch events from context to update calendar
      // This will automatically update the context state and trigger re-render
      await refetch();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportICS = (): void => {
    if (!event) return;
    const apiEvent = {
      id: event.id,
      user_id: event.resource?.user_id || 0,
      title: event.title,
      description: event.description || null,
      contacts: event.contacts || null,
      start_date: event.start.toISOString(),
      end_date: event.end.toISOString(),
      created_at: event.resource?.created_at || new Date().toISOString(),
    };
    downloadICS(apiEvent);
  };

  const handleGoogleCalendar = (): void => {
    if (!event) return;
    const apiEvent = {
      id: event.id,
      user_id: event.resource?.user_id || 0,
      title: event.title,
      description: event.description || null,
      contacts: event.contacts || null,
      start_date: event.start.toISOString(),
      end_date: event.end.toISOString(),
      created_at: event.resource?.created_at || new Date().toISOString(),
    };
    const link = generateGoogleCalendarLink(apiEvent);
    window.open(link, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Event" : "Create Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Input
            label="Contacts (comma-separated)"
            type="text"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            placeholder="email@example.com, name@example.com"
          />

          <Input
            label="Start Date & Time"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            label="End Date & Time"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              {isEditMode && (
                <>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <FiTrash2 className="inline mr-2" />
                    Delete
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleExportICS}
                    disabled={isLoading}
                  >
                    <FiDownload className="inline mr-2" />
                    Export .ics
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGoogleCalendar}
                    disabled={isLoading}
                  >
                    <FiCalendar className="inline mr-2" />
                    Add to Google
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
