import MainApp from "./apps/MainApp";
import { Route, Routes } from "react-router-dom";
import Library from "./pages/main/Library";
import { useAuth } from "./Hooks/useAuth";
import { LucideLoaderCircle } from "lucide-react";
import { ProtectedRoute } from "./utils/protection";
import AuthPage from "./pages/auth/AuthPage";
import DemoApp from "./apps/DemoApp";
import AddText from "./pages/main/AddText";

export default function App() {

  const { hasCheckedAuth, isGettingUser } = useAuth();

  if (!hasCheckedAuth || isGettingUser) return (
    <div className="h-screen flex items-center justify-center">
      <LucideLoaderCircle className="animate-spin text-5xl" />
    </div>
  )

  return (
    <Routes>
      <Route path="/app" element={
        <ProtectedRoute>
          <MainApp />
        </ProtectedRoute>
      }>
        <Route path="library" element={<Library />} />
        <Route path="add-text" element={<AddText />} />
      </Route>


      <Route path="/demo" element={<DemoApp />}>
        <Route path="library" element={
          <Library />
        } />
      </Route>

      <Route path="/login-signup" element={<AuthPage />} />
    </Routes>
  )
}