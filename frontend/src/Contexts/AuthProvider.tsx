import { useEffect, useState, type ReactNode } from 'react';
import { type User } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient.ts";
import { AuthContext } from '../Hooks/useAuth.tsx';
import api from '../lib/axios.ts';

function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error signing in:', error.message);
  };

  useEffect(() => {
    const getUserAndSetToken = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error in auth provider getting user : ", error.message);
        return;
      }
      setUser(user);

      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    };

    getUserAndSetToken();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.access_token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (

    <AuthContext.Provider value={user}>
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to Typefreaks</h1>
        {!user ? (
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        ) : (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
            {children}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
