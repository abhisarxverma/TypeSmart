import { Toaster } from "react-hot-toast";
import { useAuth } from "./Hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import AuthPage from "./Pages/Auth/AuthPage";
import { CheckIsAuthed } from "./Utils/protection";
import Layout from "./components/Layout/Layout";
import HomePage from "./Pages/Home/HomePage";
import Header from "./components/Header/Header";
import TypingPage from "./Pages/Typing/TypingPage";
import LibraryPage from "./Pages/Library/LibraryPage";
import AddTextPage from "./Pages/Add_text/AddTextPage";
import GroupPage from "./Pages/Group/GroupPage";
import TextPage from "./Pages/Text/TextPage";

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
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/typing" element={<TypingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/add" element={<AddTextPage />} />
          <Route path="/library/text/:id" element={<TextPage />} />
          <Route path="/library/group/:id" element={<GroupPage />} />
          <Route path="/login-signup" element={<CheckIsAuthed><AuthPage /></CheckIsAuthed>} />
        </Routes>
      </Layout>
    </>
  )
}

export default App;