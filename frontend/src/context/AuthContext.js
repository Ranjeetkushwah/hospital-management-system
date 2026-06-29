import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, fetchCurrentUser, logoutUser } from '../store/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    // Automatically trigger user profile lookup on reload/mount if token exists
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const login = async (username, password) => {
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
