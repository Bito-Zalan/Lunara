import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadProfile = async (u) => {
    if (!u) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id,email,is_admin")
      .eq("id", u.id)
      .single();
    setProfile(data ?? null);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data?.session?.user ?? null;
      setUser(u);
      await loadProfile(u);
      setAuthLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      await loadProfile(u);
      setAuthLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, profile, authLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
