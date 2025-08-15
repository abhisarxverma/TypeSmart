import { Toaster } from "react-hot-toast";
import { useAuth } from "./Hooks/useAuth";
import { Button } from "./components/ui/button";

function App() {

  const { user, signInWithGoogle, signOut, hasCheckedAuth } = useAuth();

  if (!hasCheckedAuth) return (
    <h1>Checking Authentication please wait...</h1>
  )

  return (
    <div style={{ padding: '2rem' }}>
      <Toaster />
      <h1>Welcome to Typefreaks</h1>
      {!user ? (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      ) : (
        <div>
          <h2>Welcome, {user.email}</h2>
          <Button onClick={signOut}>Sign Out</Button>
          <img src={user.avatar_url} alt="user's google account image"/>
        </div>
      )}
    </div>
  )
}

export default App;
