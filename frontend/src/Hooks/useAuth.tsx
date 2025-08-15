import { createContext, useContext } from "react";
import { type User } from "../Types/User";

interface AuthContextType {
  user: User | null;
  hasCheckedAuth: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext< AuthContextType | null >(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
