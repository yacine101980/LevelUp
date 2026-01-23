import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { loginAPI,logoutAPI, registerAPI, getProfileAPI, updateProfileAPI } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const logout = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await logoutAPI(token);
      } catch (error) {
        console.error('Erreur lors de la déconnexion côté serveur:', error);
        // Continue même si l'API échoue
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);
  
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const userData = await getProfileAPI(token);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);



  const login = async (email, password) => {
    const { token } = await loginAPI(email, password);
    localStorage.setItem('token', token);
    await fetchUserProfile(token);
  };

  const register = async (name, email, password) => {
    return await registerAPI(name, email, password);
  };


  const updateProfile = async (name, email) => {
    const token = localStorage.getItem('token');
    const updatedUser = await updateProfileAPI(token, { name, email });
     const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading, fetchUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);