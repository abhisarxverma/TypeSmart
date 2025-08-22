import { useAuth } from "@/Hooks/useAuth";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login-signup" />;
}

export function CheckIsAuthed({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
}
