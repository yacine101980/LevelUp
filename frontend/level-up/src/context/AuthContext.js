import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // On ajoute une date de création fictive si elle n'existe pas
    const userWithDate = { ...userData, createdAt: userData.createdAt || new Date().toISOString() };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithDate));
    setUser(userWithDate);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // --- NOUVELLE FONCTION ---
  const updateProfile = async (name, email) => {
    try {
      // Simulation d'un appel API (ici on met juste à jour le state local)
      const updatedUser = { ...user, name, email };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: "Impossible de mettre à jour le profil" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);