import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("--- CHECK PROTECTED ROUTE ---");
  console.log("Loading status:", loading);
  console.log("User status:", user ? "LOGGED IN" : "NULL");

  // 1. Se sta ancora caricando, NON fare il redirect. Aspetta.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-[#0ea5e9]">Verifica autorizzazione...</div>
      </div>
    );
  }

  // 2. Se ha finito di caricare e l'utente NON c'è, allora vai al login
  if (!user) {
    console.warn("Accesso negato, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se l'utente c'è, carica la Dashboard
  console.log("Accesso garantito!");
  return children;
};