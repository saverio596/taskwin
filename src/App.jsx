import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth'; // Importa il nuovo file unico

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#020617]">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<div className="text-white p-10 text-3xl">Dashboard Protetta</div>} />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Se qualcuno scrive /register per errore, lo mandiamo comunque ad Auth */}
          <Route path="/register" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;