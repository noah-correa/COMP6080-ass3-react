import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import API from './API';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const ProvideAuth = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('bb_token') || null);
  const [title, setTitle] = useState('BigBrain');

  // Update app title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // Register function
  const register = async (email, password, name) => {
    const data = await API.register(email, password, name);
    if (!data.error) {
      setToken(data.token);
      localStorage.setItem('bb_token', data.token);
    }
    return data;
  }

  // Login function
  const login = async (email, password) => {
    const data = await API.login(email, password);
    if (!data.error) {
      setToken(data.token);
      localStorage.setItem('bb_token', data.token);
    }
    return data;
  }

  // Logout function
  const logout = async () => {
    const data = await API.logout(token);
    if (!data.error) {
      setToken('');
      localStorage.clear('bb_token');
    }
    return data;
  }

  const value = {
    token,
    register,
    login,
    logout,
    setTitle,
  };

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}

ProvideAuth.propTypes = {
  children: PropTypes.node,
}
