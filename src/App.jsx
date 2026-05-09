import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617]">
      <Routes>
        {/* Se l'utente è già loggato, la pagina /login lo manda in dashboard */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Auth />} 
        />
        
        {/* La Dashboard è protetta: solo chi ha user può vederla */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="text-white p-10">
                <h1 className="text-3xl font-bold">Benvenuto nella Dashboard, {user?.email}</h1>
                <p className="mt-4 text-gray-400">Qui vedrai i tuoi lead presto.</p>
              </div>
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;