import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const passwordRequirements = [
    { re: /.{8,}/, label: "Almeno 8 caratteri" },
    { re: /[A-Z]/, label: "Una lettera maiuscola" },
    { re: /[0-9]/, label: "Un numero" },
    { re: /[^A-Za-z0-9]/, label: "Un carattere speciale" },
  ];

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    let intervalId = null;

    // Strategia: polling ogni 500ms per verificare se la sessione è apparsa,
    // con un timeout massimo di 5 secondi prima di dichiarare errore.
    // Questo è più robusto dell'ascoltare onAuthStateChange perché:
    // - Non soffre del doppio mount di StrictMode
    // - Non dipende dall'ordine degli eventi PKCE

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && isMounted) {
        setIsReady(true);
        setErrorStatus(false);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      }
    };

    // Controlla subito
    checkSession();

    // Poi continua a controllare ogni 500ms
    intervalId = setInterval(checkSession, 500);

    // Dopo 5 secondi, se non c'è sessione, dichiara errore
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (isMounted && !isReady) {
        setErrorStatus(true);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    const isPasswordValid = passwordRequirements.every(req => req.re.test(newPassword));
    if (!isPasswordValid) {
      alert("La password non rispetta i requisiti di sicurezza!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      alert("Errore durante l'aggiornamento: " + error.message);
    } else {
      alert("Password aggiornata con successo! Ora puoi accedere.");
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  if (errorStatus) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-sans p-4">
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl text-center max-w-sm">
          <p className="text-sm text-slate-400 mb-4">La sessione di recupero è scaduta o l'URL non contiene i token di sicurezza.</p>
          <button
            onClick={() => navigate('/login')}
            className="text-xs bg-[#1e293b] hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Torna al login
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white font-sans p-4">
        <p className="text-sm text-slate-400 mb-2">Sincronizzazione della sessione di sicurezza...</p>
        <p className="text-xs text-slate-600">Attendi un istante.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[32px] w-full max-w-[440px] shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Imposta una nuova password</h2>
        <p className="text-xs text-slate-500 mb-6">Scegli una password sicura per il tuo account</p>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="text-left space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Nuova Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#020617] border border-slate-800 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#0ea5e9] transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-left">
            {passwordRequirements.map((req, index) => {
              const isPassed = req.re.test(newPassword);
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${isPassed ? 'bg-green-500' : 'bg-slate-600'}`} />
                  <span className={`text-[10px] ${isPassed ? 'text-green-500' : 'text-slate-500'}`}>{req.label}</span>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Aggiornamento...' : 'Conferma nuova password'}
          </button>
        </form>
      </div>
    </div>
  );
}