export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  created_at: Date;
}

export interface Event {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  contacts?: string | null;
  start_date: Date;
  end_date: Date;
  created_at: Date;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  contacts?: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  contacts?: string;
  start_date?: string; // ISO string
  end_date?: string; // ISO string
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
  user: Omit<User, 'created_at'>;
}
