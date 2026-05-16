import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';
import { ProtectedRoute } from './components/ProtectedRoute';

// Dentro App.jsx
function App() {
  const { user, loading, isRecoverySession } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#020617]"></div>;
  }

  return (
    <Routes>
      {/* 1. SE SIAMO IN RECOVERY, mostriamo SEMPRE la pagina di reset a prescindere dall'URL */}
      {isRecoverySession && (
        <Route path="*" element={<ResetPassword />} />
      )}

      {/* 2. Rotte standard (attive solo se NON siamo in recovery) */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />} 
      />
      
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

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