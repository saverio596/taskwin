import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0ea5e9]">taskwin.</h1>
            <p className="text-gray-400 text-sm">Benvenuto nella tua area privata</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Esci
          </button>
        </div>

        {/* Card di benvenuto */}
        <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-2 text-white">Ciao, {user?.user_metadata?.full_name || 'Utente'}</h2>
          <p className="text-gray-400">
            Il tuo sistema di gestione lead è pronto per essere configurato.
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <span className="block text-blue-400 text-2xl font-bold">0</span>
              <span className="text-xs uppercase tracking-wider text-gray-500">Lead Totali</span>
            </div>
            {/* Altre card qui in futuro */}
          </div>
        </div>
      </div>
    </div>
  );
}