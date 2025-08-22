import { Toaster } from "react-hot-toast";
import { useAuth } from "./Hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import AuthPage from "./Pages/Auth/AuthPage";
import { ProtectedRoute, CheckIsAuthed } from "./Utils/protection";
import Layout from "./components/Layout/Layout";
import HomePage from "./Pages/Home/HomePage";

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
        </Routes>
      </Layout>
    </>
  )
}

export default App;
