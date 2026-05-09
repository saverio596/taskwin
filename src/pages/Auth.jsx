import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  // Stato per capire se siamo in modalità "Login" o "Registrati"
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isLogin) {
      // Logica Accesso
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`Errore: ${error.message}`);
      else navigate('/dashboard');
    } else {
      // Logica Registrazione
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(`Errore: ${error.message}`);
      else setMessage('Controlla la tua email per confermare l\'account!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          lead<span className="text-[#0ea5e9]">win</span><span className="text-[#0ea5e9]">.</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">L'intelligenza per il tuo business.</p>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[32px] w-full max-w-[440px] shadow-2xl">
        
        {/* IL TOGGLE (Identico al tuo screen) */}
        <div className="flex bg-[#1e293b] p-1 rounded-2xl mb-8 relative">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-xl font-medium transition-all z-10 ${isLogin ? 'text-white bg-[#0ea5e9] shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Accedi
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-xl font-medium transition-all z-10 ${!isLogin ? 'text-white bg-[#0ea5e9] shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Registrati
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {/* Email */}
          <div>
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
                className="w-full bg-[#1e293b] border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#1e293b] border border-slate-700 text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isLogin && (
            <button type="button" className="text-[#0ea5e9] text-sm font-medium hover:underline ml-1 block">
              Password dimenticata?
            </button>
          )}

          {/* Bottone Dinamico */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Attendere...' : (isLogin ? 'Accedi' : 'Registrati')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
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