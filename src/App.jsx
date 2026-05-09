import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  // Se sta caricando, mostriamo uno sfondo scuro per non far lampeggiare il login
  if (loading) {
    return <div className="min-h-screen bg-[#020617]"></div>;
  }

  return (
    <Routes>
      {/* Se l'utente è loggato, questa rotta lo spinge SEMPRE in dashboard */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />} 
      />
      
      {/* Rotta protetta per la Dashboard */}
      <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

      {/* Gestione della Home e delle pagine inesistenti */}
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
      
      <Route 
        path="*" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}

export default App;