import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 100% Real: App khulte hi user ka "Asli" data MongoDB se lana
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('trn_token');
      if (token) {
        try {
          const res = await api.get('/user/me');
          if (res.data.success) setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem('trn_token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
