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

  // Stato per capire se siamo in modalità "Login" o "Registrati"
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
  e.preventDefault();


  if (!isLogin) {
    const isPasswordValid = passwordRequirements.every(req => req.re.test(password));
    if (!isPasswordValid) {
      alert("La password non rispetta i requisiti di sicurezza!");
      return;
    }
  }

  setLoading(true);
  
  if (isLogin) {
    // Login invariato
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  } else {
    // REGISTRAZIONE con Nome Completo
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

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-5 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          <span className="text-white">task</span><span className="text-[#0ea5e9]">win</span><span className="text-[#0ea5e9]">.</span>
        </h1>
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
          {/*nome completo*/}

          {!isLogin && (
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

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"} // <--- Qui cambia dinamicamente
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all"
      placeholder="••••••••"
    />
    
    {/* Bottone per mostrare/nascondere */}
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
{!isLogin && (
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