import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Auth() {

  const passwordRequirements = [
    { re: /.{8,}/, label: "Almeno 8 caratteri" },
    { re: /[A-Z]/, label: "Una lettera maiuscola" },
    { re: /[0-9]/, label: "Un numero" },
    { re: /[^A-Za-z0-9]/, label: "Un carattere speciale" },
  ];

  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();



  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');

    if (authMode === 'forgot') {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage("Link di recupero inviato! Controlla la tua email.");
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (authMode === 'register') {
      const isPasswordValid = passwordRequirements.every(req => req.re.test(password));
      if (!isPasswordValid) {
        alert("La password non rispetta i requisiti di sicurezza!");
        return;
      }
    }

    setLoading(true);

    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Registrazione avvenuta!");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Al termine del login con Google, l'utente verrà rispedito qui
          redirectTo: window.location.origin + '/dashboard',
        },
      });

      if (error) throw error;
    } catch (error) {
      alert("Errore durante il login con Google: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-5 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          <span className="text-white">task</span><span className="text-[#0ea5e9]">win</span><span className="text-[#0ea5e9]">.</span>
        </h1>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[32px] w-full max-w-[440px] shadow-2xl">

        {/* IL TOGGLE (Nascosto se siamo in modalità recupero password) */}
        {authMode !== 'forgot' && (
          <div className="flex bg-[#1e293b] p-1 rounded-2xl mb-8 relative">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-xl font-medium transition-all z-10 ${authMode === 'login' ? 'text-white bg-[#0ea5e9] shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Accedi
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-xl font-medium transition-all z-10 ${authMode === 'register' ? 'text-white bg-[#0ea5e9] shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Registrati
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">

          {/* Nome Completo (Solo in registrazione) */}
          {authMode === 'register' && (
            <div className="text-left">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Nome Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all"
                placeholder="Mario Rossi"
              />
            </div>
          )}

          {/* Email (Sempre visibile) */}
          <div className="text-left">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="mario@esempio.com"
                className="w-full bg-[#1e293b] border border-slate-700 text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password (Nascosta se siamo in modalità recupero password) */}
          {authMode !== 'forgot' && (
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#0ea5e9] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Requisiti password (Solo in registrazione) */}
          {authMode === 'register' && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {passwordRequirements.map((req, index) => {
                const isPassed = req.re.test(password);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${isPassed ? 'bg-green-500' : 'bg-slate-600'}`} />
                    <span className={`text-[10px] ${isPassed ? 'text-green-500' : 'text-slate-500'}`}>
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}


          {/* Sottotesto informativo (Solo in modalità recupero password) */}
          {authMode === 'forgot' && (
            <p className="text-sm text-gray-400 text-center px-2">
              Inserisci la tua email per ricevere un link di recupero password.
            </p>
          )}

          {/* Link Password Dimenticata (Solo in login) */}
          {authMode === 'login' && (
            <button
              type="button"
              onClick={() => setAuthMode('forgot')}
              className="text-[#0ea5e9] text-sm font-medium hover:underline ml-1 block"
            >
              Password dimenticata?
            </button>
          )}


          {authMode === 'login' && (
            <>
              <div className="relative flex items-center justify-center my-6">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-[#0f172a] px-2">
                  Oppure
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-slate-800 border border-slate-800 text-white font-medium py-3 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  {/* Icona SVG di Google */}
                  <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.42 3.66 1.48 7.55l3.8 2.94C6.2 7.55 8.9 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.67 2.84c2.15-1.98 3.38-4.9 3.38-8.48z" />
                  <path fill="#FBBC05" d="M5.28 14.81c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31L1.48 7.25C.67 8.88.2 10.7.2 12.65c0 1.95.47 3.77 1.28 5.4l3.8-3.24z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.67-2.84c-1.1.74-2.51 1.18-4.29 1.18-3.1 0-5.8-2.51-6.73-5.45l-3.8 2.94C3.42 20.34 7.35 23 12 23z" />
                </svg>
                Accedi con Google
              </button>
            </>
          )}

          {/* Bottone Dinamico principale */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Attendere...' : (authMode === 'login' ? 'Accedi' : authMode === 'register' ? 'Registrati' : 'Invia email di recupero')}
            {authMode !== 'forgot' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>

          {/* Pulsante per tornare al login (Solo in modalità recupero) */}
          {authMode === 'forgot' && (
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1.5 pt-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Torna al login
            </button>
          )}

        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-2xl text-center text-sm ${message.includes('Errore') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}