import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#020617] text-white p-10">Caricamento...</div>;

  if (!user) {
    // Se non sei loggato, torna al login
    return <Navigate to="/login" />;
  }

  return children;
};