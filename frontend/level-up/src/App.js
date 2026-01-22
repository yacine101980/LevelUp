import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Zap, Calendar, LayoutDashboard, LogOut, User } from 'lucide-react';

// Import des pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Goals from './pages/Goals';   // On vient de le créer
import Habits from './pages/Habits'; // On vient de le créer

import './App.css';

// Composant qui gère la mise en page (Header + Contenu)
function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Permet de savoir sur quelle page on est

  // Fonction pour vérifier si un lien est actif (pour la couleur bleue)
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header (La barre en haut) */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">LevelUp</h1>
            </div>

            {/* Navigation Desktop */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">Tableau de bord</span>
              </button>

              <button
                onClick={() => navigate('/goals')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/goals') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span className="hidden sm:inline">Objectifs</span>
              </button>

              <button
                onClick={() => navigate('/habits')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/habits') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">Habitudes</span>
              </button>

              {/* Menu Utilisateur */}
              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => navigate('/profile')}
                  className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/profile') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.name || 'Utilisateur'}</span>
                </button>
                
                <button
                  onClick={async () => { await logout(); navigate('/login'); } }
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

// Composant Wrapper pour protéger les routes (redirige si pas connecté)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes Publiques (Pas de Header) */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes Protégées (Avec Header) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/goals" element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } />

          <Route path="/habits" element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;