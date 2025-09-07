import MainApp from "./apps/MainApp";
import { Route, Routes } from "react-router-dom";
import Library from "./pages/main/Library";
import { useAuth } from "./Hooks/useAuth";
import { LucideLoaderCircle } from "lucide-react";
import { ProtectedRoute } from "./utils/protection";
import AuthPage from "./pages/auth/AuthPage";
import DemoApp from "./apps/DemoApp";
import AddText from "./pages/main/AddText";
import TextDetails from "./pages/main/TextDetails";
import EditText from "./pages/main/EditText";
import GroupDetails from "./pages/main/GroupDetails";
import TypingPage from "./pages/typing/TypingPage";

export default function App() {

  const { hasCheckedAuth, isGettingUser } = useAuth();

  if (isGettingUser) return (
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
        <Route path="library/text/:id" element={<TextDetails />} />
        <Route path="library/edit-text/:id" element={<EditText />} />
        <Route path="library/group/:id" element={<GroupDetails />} />
        <Route path="typing" element={<TypingPage />} />
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