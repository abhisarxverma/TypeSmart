import { useAuth } from "@/Hooks/useAuth";
import { LucideLoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isGettingUser, hasCheckedAuth } = useAuth();

  if (!hasCheckedAuth || isGettingUser) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-1">
        <LucideLoaderCircle className="animate-spin text-5xl" />
        <p>Please wait</p>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login-signup" />;
}

export function CheckIsAuthed({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
}

export function useProtectFeature(func: () => void, mode: string) {
  if (mode === "main") return func;
  else {
    console.log("Returning the demo mode toast.")
    return () => toast.error("This is demo mode, please sign in!")
  }
}