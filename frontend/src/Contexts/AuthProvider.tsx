import { useEffect, useState, type ReactNode } from 'react';
import supabase from "../lib/supabaseClient.ts";
import { AuthContext } from '../Hooks/useAuth.tsx';
import api from '../lib/axios.ts';
import type { User } from '../Types/User.ts';

function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error signing in:', error.message);
  };

  function signOut() {
    supabase.auth.signOut()
      .then(() => {
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setHasCheckedAuth(true);
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  }


  async function getRealUser() {
    try {
      const res = await api.get("/auth/getuser");
      const data = res.data;
      console.log("Getting user fetch result : ", data)
      if (data.error) {
        console.log("Error in getting real user : ", data.error);
      }
      setUser(data);
    } catch (error) {
      console.log("Error in Get real user : ", error);
    } finally {
      setHasCheckedAuth(true);
    }
  }

  useEffect(() => {
    const getUserAndSetToken = async () => {
      const { data: { user: rawUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error in auth provider getting user : ", error.message);
        return;
      }

      if (rawUser) {
        console.log("RAWUSER : ", rawUser);
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        // console.log("ACCESS TOKEN : ", token)
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await getRealUser();
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
        setUser(null);
        setHasCheckedAuth(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (

    <AuthContext.Provider value={{ user, hasCheckedAuth, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
