import { Toaster } from "react-hot-toast";
import { useAuth } from "./Hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import { ProtectedRoute, CheckIsAuthed } from "./utils/protection";
import Layout from "./components/Layout";
import LibraryPage from "./Pages/LibraryPage";

function App() {

  const { hasCheckedAuth, isGettingUser } = useAuth();

  if (!hasCheckedAuth || isGettingUser) return (
    <div className="h-screen flex items-center justify-center">
      <LuLoaderCircle className="animate-spin text-black text-5xl" />
    </div>
  )

  return (
    <>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/login-signup" element={<CheckIsAuthed><AuthPage /></CheckIsAuthed>} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App;
