import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// 1. Creiamo il contesto
const AuthContext = createContext({});

// 2. Creiamo il Provider (il componente che avvolge l'app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla se c'è una sessione attiva al caricamento della pagina
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Ascolta i cambiamenti di stato (Login, Logout, Password Recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Pulizia del listener quando il componente viene smontato
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funzione per il Logout (comoda da avere qui)
  const signOut = () => supabase.auth.signOut();

  const value = {
    user,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizzato per usare l'autenticazione facilmente nelle pagine
export const useAuth = () => useContext(AuthContext);