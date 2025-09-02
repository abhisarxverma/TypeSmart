import { useEffect, useState, type ReactNode } from 'react';
import supabase from "../lib/supabaseClient.ts";
import { AuthContext } from '@/Hooks/useAuth.tsx';
import api from '../lib/axios.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useGetRealUserQuery } from '@/Hooks/useBackend.tsx';

function AuthProvider({ children }: { children: ReactNode }) {

  const [token, setToken] = useState<string | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { user, isGettingUser, refetch } = useGetRealUserQuery(token);

  // console.log("USER : ", user)

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
        setToken(null);
        queryClient.removeQueries({queryKey: ["user"]});
        setHasCheckedAuth(true);
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  }

  useEffect(() => {
    const getUserAndSetToken = async () => {
      const { data: { user: rawUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error in auth provider getting user : ", error.message);
        setHasCheckedAuth(true);
        return;
      }

      if (rawUser) {
        // console.log("RAWUSER : ", rawUser);
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setToken(token);
        }
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
      setHasCheckedAuth(true);
    };
    
    getUserAndSetToken();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newToken = session?.access_token;
      if (newToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken)
        refetch();
      } else {
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        refetch();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [refetch]);

  return (

    <AuthContext.Provider value={{ user, hasCheckedAuth, signInWithGoogle, signOut, isGettingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
