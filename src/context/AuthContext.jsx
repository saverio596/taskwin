import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const isRecoveryRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      console.log('AUTH EVENT:', event, session);

      if (event === 'PASSWORD_RECOVERY') {
        isRecoveryRef.current = true;
        setIsRecoverySession(true);
        setUser(session?.user ?? null);
        setLoading(false);
        // Segnala alle ALTRE tab che c'è un recovery in corso
        localStorage.setItem('recovery_active', Date.now().toString());
      } else if (event === 'SIGNED_IN') {
        if (!isRecoveryRef.current) {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        isRecoveryRef.current = false;
        setIsRecoverySession(false);
        setUser(null);
        setLoading(false);
      } else {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // L'evento 'storage' si attiva SOLO nelle tab diverse da quella che ha scritto.
    // NON chiamiamo signOut (distruggerebbe i token condivisi in localStorage).
    // Azzeriamo solo lo state React per nascondere la dashboard visivamente.
    const handleStorageChange = (e) => {
      if (!isMounted) return;
      if (e.key === 'recovery_active' && e.newValue) {
        const timestamp = parseInt(e.newValue);
        if (Date.now() - timestamp < 60000) {
          // Solo React state — la sessione Supabase resta intatta per la tab di recovery
          setUser(null);
          setLoading(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const initializeAuth = async () => {
      if (!isMounted) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signOut = async () => {
    localStorage.removeItem('recovery_active');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isRecoverySession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);