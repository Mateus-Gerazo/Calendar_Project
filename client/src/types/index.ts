export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface Event {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  contacts?: string | null;
  start_date: string; // ISO string from API
  end_date: string; // ISO string from API
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string | null;
  contacts?: string | null;
  start: Date;
  end: Date;
  resource?: {
    user_id: number;
    created_at: string;
  };
}

export interface CreateEventDto {
  title: string;
  description?: string;
  contacts?: string;
  start_date: string;
  end_date: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  contacts?: string;
  start_date?: string;
  end_date?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
