import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Recuperiamo il nome estratto dai metadati (o usiamo una fallback)
  const displayName = user?.user_metadata?.full_name || 'Saverio';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Funzione helper per ottenere la data odierna formattata
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      
      {/* 1. SIDEBAR LATERALE */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 fixed h-full z-10">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Connetti.</h1>
            <p className="text-xs text-slate-400 mt-0.5">Social Platform</p>
          </div>

          {/* Menu di Navigazione */}
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-[#4f46e5] text-white rounded-xl shadow-sm transition-all">
              {/* Icona Dashboard */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Dashboard
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
              {/* Icona Bacheca / Post */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              Bacheca
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
              {/* Icona Notifiche */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              Notifiche
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
              {/* Icona Profilo */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Profilo
            </button>
          </nav>
        </div>

        {/* Profilo in basso ed Esci */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4f46e5] flex items-center justify-center font-bold text-sm uppercase">
              {displayName.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M19.5 12l-3-3m3 3-3 3m3-3H9" />
            </svg>
            Esci
          </button>
        </div>
      </aside>

      {/* 2. AREA CONTENUTO PRINCIPALE (A destra della sidebar) */}
      <main className="flex-1 ml-64 p-10 max-w-6xl">
        
        {/* Banner di benvenuto sfumato */}
        <div className="bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#a5b4fc] text-white p-8 rounded-3xl shadow-sm relative overflow-hidden mb-8">
          <div className="relative z-10">
            <span className="text-xs font-medium opacity-90 flex items-center gap-1.5 mb-2">
              ✨ {getFormattedDate()}
            </span>
            <h2 className="text-3xl font-serif font-bold mb-2">
              Bentornato, {displayName.split(' ')[0]}!
            </h2>
            <p className="text-sm opacity-80 max-w-md">
              Ecco cosa succede sulla piattaforma. Esplora i nuovi post e resta aggiornato.
            </p>
          </div>
          {/* Cerchio estetico trasparente sullo sfondo */}
          <div className="absolute right-[-10%] top-[-20%] w-72 h-72 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        </div>

        {/* Griglia delle Card Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#4f46e5] rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-bold text-slate-900">3</span>
              <span className="text-xs text-slate-400 font-medium">Post recenti</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-pink-50 text-pink-500 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-bold text-slate-900">0</span>
              <span className="text-xs text-slate-400 font-medium">Mi piace totali</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-sky-50 text-sky-500 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-bold text-slate-900">0</span>
              <span className="text-xs text-slate-400 font-medium">Notifiche</span>
            </div>
          </div>

        </div>

        {/* Sezione Sezionale Ultimi Post */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">Ultimi post</h3>
            <button className="text-xs font-semibold text-[#4f46e5] flex items-center gap-1 hover:underline">
              Vedi tutti <span>&rarr;</span>
            </button>
          </div>

          {/* Lista Post / Contenuti */}
          <div className="space-y-4">
            
            {/* Post 1 */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Suggerimenti per un buon profilo</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Ecco alcuni consigli: 1. Aggiungi una foto profilo professionale 2. Scrivi una bio che ti rappresenti 3. Includi il link al tuo portfolio o sito we...
              </p>
              <div className="flex gap-4 text-[11px] font-medium text-slate-400">
                <span>Admin</span>
                <span className="flex items-center gap-1">❤️ 0</span>
                <span className="flex items-center gap-1">💬 0</span>
              </div>
            </div>

            {/* Post 2 */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Novità in arrivo</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Stiamo lavorando a nuove funzionalità per migliorare l'esperienza sulla piattaforma. Restate sintonizzati per aggiornamenti! 📢
              </p>
              <div className="flex gap-4 text-[11px] font-medium text-slate-400">
                <span>Admin</span>
                <span className="flex items-center gap-1">❤️ 0</span>
                <span className="flex items-center gap-1">💬 0</span>
              </div>
            </div>

            {/* Post 3 */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Benvenuti sulla piattaforma!</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Ciao a tutti! Questa è la nostra nuova piattaforma social. Sentitevi liberi di condividere le vostre idee, progetti e pensieri. Buona...
              </p>
              <div className="flex gap-4 text-[11px] font-medium text-slate-400">
                <span>Admin</span>
                <span className="flex items-center gap-1">❤️ 0</span>
                <span className="flex items-center gap-1">💬 0</span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}