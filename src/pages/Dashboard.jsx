import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Stati dell'applicazione
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState(''); // INTEGRATO: Stato per il titolo
  const [isModalOpen, setIsModalOpen] = useState(false); // INTEGRATO: Stato per apertura modale
  const [loading, setLoading] = useState(false);

  const displayName = user?.user_metadata?.full_name || 'Utente';

  // Caricamento iniziale dei post
  useEffect(() => {
    fetchPosts();
  }, []);

  // 1. Lettura dei post da Supabase
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Errore nel caricamento dei post:', error.message);
    }
  };

  // 2. Creazione di un nuovo post (Modificata per gestire il form della modale)
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPostContent.trim() === '' || newPostTitle.trim() === '') return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert([
          {
            title: newPostTitle, // INTEGRATO: Invio del titolo
            content: newPostContent,
            user_id: user.id,
            user_name: displayName,
          }
        ]);

      if (error) throw error;

      setNewPostContent('');
      setNewPostTitle(''); // INTEGRATO: Reset titolo
      setIsModalOpen(false); // INTEGRATO: Chiude la modale dopo la pubblicazione
      fetchPosts(); 
    } catch (error) {
      alert('Impossibile pubblicare il post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#030712] text-[#f8fafc] font-sans relative">
      
      {/* 1. SIDEBAR LATERALE */}
      <aside className="w-64 bg-[#0b0f19] border-r border-slate-900 flex flex-col justify-between p-6 fixed h-full z-10">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              <span className="text-white">task</span><span className="text-[#3ca0e6]">win.</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Social Platform</p>
          </div>

          {/* Menu di Navigazione */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'dashboard' ? 'bg-[#3ca0e6] text-white shadow-[0_0_15px_rgba(60,160,230,0.3)]' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Dashboard
            </button>

            <button 
              onClick={() => setActiveTab('bacheca')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'bacheca' ? 'bg-[#3ca0e6] text-white shadow-[0_0_15px_rgba(60,160,230,0.3)]' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              Bacheca
            </button>

            <button 
              onClick={() => setActiveTab('notifiche')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'notifiche' ? 'bg-[#3ca0e6] text-white shadow-[0_0_15px_rgba(60,160,230,0.3)]' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              Notifiche
            </button>

            <button 
              onClick={() => setActiveTab('profilo')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'profilo' ? 'bg-[#3ca0e6] text-white shadow-[0_0_15px_rgba(60,160,230,0.3)]' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Profilo
            </button>
          </nav>
        </div>

        {/* Profilo Inferiore */}
        <div className="border-t border-slate-900 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e293b] text-[#3ca0e6] border border-slate-800 flex items-center justify-center font-bold text-sm uppercase">
              {displayName.charAt(0)}
            </div>
            <div className="truncate text-left">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-red-400 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M19.5 12l-3-3m3 3-3 3m3-3H9" />
            </svg>
            Esci
          </button>
        </div>
      </aside>

      {/* 2. AREA CONTENUTO PRINCIPALE */}
      <main className="flex-1 ml-64 p-10 max-w-6xl">
        
        {/* ================= TAB: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-8 rounded-3xl border border-slate-850 relative overflow-hidden mb-8 shadow-xl">
              <div className="relative z-10">
                <span className="text-xs font-medium text-[#3ca0e6] flex items-center gap-1.5 mb-2">⚡️ {getFormattedDate()}</span>
                <h2 className="title-welcome-dashboard">Bentornato, {displayName}!</h2>
                <p className="text-sm text-slate-400 max-w-lg text-left">Ecco cosa succede sulla piattaforma. Esplora i nuovi post e resta aggiornato.</p>
              </div>
              <div className="absolute right-[-5%] top-[-20%] w-60 h-60 rounded-full bg-[#3ca0e6]/10 blur-3xl pointer-events-none"></div>
            </div>

            {/* Card Statistiche con Icone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-[#3ca0e6] rounded-xl border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-white">{posts.length}</span>
                  <span className="text-xs text-slate-500 font-medium">Post in bacheca</span>
                </div>
              </div>

              <div className="bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-pink-400 rounded-xl border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-white">0</span>
                  <span className="text-xs text-slate-500 font-medium">Mi piace totali</span>
                </div>
              </div>

              <div className="bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-amber-400 rounded-xl border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-white">0</span>
                  <span className="text-xs text-slate-500 font-medium">Notifiche</span>
                </div>
              </div>
            </div>

            {/* Anteprimes Post Reali */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-white tracking-tight">Ultimi Post</h3>
                <button onClick={() => setActiveTab('bacheca')} className="text-xs font-semibold text-[#3ca0e6] hover:underline">Vedi tutti &rarr;</button>
              </div>

              <div className="space-y-4">
                {posts.slice(0, 2).map((post) => (
                  <div key={post.id} className="bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl shadow-sm text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-sm">{post.user_name}</h4>
                      <span className="text-[10px] text-slate-500">{new Date(post.created_at).toLocaleDateString('it-IT')}</span>
                    </div>
                    {post.title && <h5 className="font-bold text-[#3ca0e6] text-xs mb-1">{post.title}</h5>}
                    <p className="text-slate-400 text-xs leading-relaxed">{post.content}</p>
                  </div>
                ))}
                {posts.length === 0 && <p className="text-xs text-slate-500 text-left">Nessun post pubblicato finora.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: BACHECA DINAMICA ================= */}
        {activeTab === 'bacheca' && (
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight">Bacheca</h2>
              <p className="text-sm text-slate-500 mt-1">Condividi idee e interagisci con la community</p>
            </div>

            {/* INTEGRATO: La barra ora è un trigger cliccabile che apre la modale */}
            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0b0f19] border border-slate-900 p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-slate-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#1e293b] text-[#3ca0e6] border border-slate-800 flex items-center justify-center font-bold text-sm uppercase">
                {displayName.charAt(0)}
              </div>
              <span className="text-xs text-slate-500 font-medium">Cosa vuoi condividere oggi?</span>
            </div>

            {/* Feed Dinamico */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl text-left shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-[#3ca0e6] flex items-center justify-center font-bold text-xs uppercase">
                      {post.user_name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-white">{post.user_name}</h5>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(post.created_at).toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {post.title && <h4 className="text-sm font-bold text-white mb-1">{post.title}</h4>}
                  <p className="text-slate-300 text-xs leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex gap-6 border-t border-slate-900 pt-3 text-xs text-slate-500 font-medium">
                    <button className="hover:text-pink-500 transition-colors flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                      {post.likes_count || 0}
                    </button>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-10">La bacheca è vuota. Scrivi qualcosa nel box qui sopra per iniziare!</p>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: NOTIFICHE ================= */}
        {activeTab === 'notifiche' && (
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight">Notifiche</h2>
              <p className="text-sm text-slate-500 mt-1">Tutto letto!</p>
            </div>
            <div className="h-96 bg-[#0b0f19] border border-slate-900 rounded-3xl flex flex-col items-center justify-center text-center p-6 shadow-sm">
              <div className="p-4 bg-slate-900 text-amber-400 rounded-full border border-slate-800 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-white">Nessuna notifica</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">Qui appariranno gli avvisi quando gli utenti interagiranno con i tuoi post.</p>
            </div>
          </div>
        )}

        {/* ================= TAB: PROFILO ================= */}
        {activeTab === 'profilo' && (
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight">Il tuo profilo</h2>
              <p className="text-sm text-slate-500 mt-1">Gestisci le tue informazioni personali</p>
            </div>

            <div className="bg-[#0b0f19] border border-slate-900 rounded-3xl overflow-hidden shadow-xl text-left">
              <div className="h-32 bg-gradient-to-r from-[#3ca0e6]/20 via-slate-800 to-[#3ca0e6]/10"></div>
              <div className="p-6 relative pt-0 flex items-end gap-4 -mt-10">
                <div className="w-20 h-20 rounded-2xl bg-[#1e293b] border-4 border-[#0b0f19] text-[#3ca0e6] flex items-center justify-center font-bold text-2xl shadow-xl uppercase">
                  {displayName.charAt(0)}
                </div>
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-white">{displayName}</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f19] border border-slate-900 p-6 rounded-3xl space-y-5 text-left shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                <textarea placeholder="Raccontaci qualcosa su di te..." rows={3} className="w-full bg-[#030712] border border-slate-850 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#3ca0e6] transition-colors resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Località</label>
                  <input type="text" placeholder="es. Milano, Italia" className="w-full bg-[#030712] border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#3ca0e6] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sito web</label>
                  <input type="text" placeholder="https://iltuosito.com" className="w-full bg-[#030712] border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#3ca0e6] transition-colors" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button className="bg-[#3ca0e6] hover:bg-[#2a8ec4] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(60,160,230,0.2)]">
                  Salva modifiche
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          ================ INTEGRATO: MODALE POPUP (NUOVO POST) ==================
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0f19] border border-slate-850 rounded-2xl max-w-xl w-full shadow-2xl p-6 relative text-left space-y-4">
            
            {/* Header Modale */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <h3 className="text-base font-bold text-white">Nuovo post</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-500 hover:text-white rounded-full p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <input 
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Titolo del post"
                  className="w-full bg-[#030712] border border-slate-850 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ca0e6] transition-colors"
                />
              </div>

              <div>
                <textarea 
                  required
                  rows={5}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Scrivi qualcosa di interessante..."
                  className="w-full bg-[#030712] border border-slate-850 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ca0e6] transition-colors resize-none"
                ></textarea>
              </div>

              {/* Footer Modale */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#3ca0e6] hover:bg-[#2a8ec4] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(60,160,230,0.2)] disabled:opacity-50"
                >
                  {loading ? "Pubblicazione..." : "Pubblica"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}