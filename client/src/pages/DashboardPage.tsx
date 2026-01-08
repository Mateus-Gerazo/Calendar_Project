import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCalendar } from "../context/CalendarContext";
import { CalendarWrapper } from "../components/Calendar/CalendarWrapper";
import { Loader } from "../components/UI/Loader";
import { Button } from "../components/UI/Button";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { events, loading, error } = useCalendar();
  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
          <Button variant="secondary" onClick={() => navigate("/ai-admin")}>
            AI Admin
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <CalendarWrapper events={events} />
      </main>
    </div>
  );
};
