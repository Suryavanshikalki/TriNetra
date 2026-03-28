import React, { createContext, useState, useEffect } from 'react';

// 👁️ TRINETRA MASTER CONTEXT: Ye aapke app ka asli dil hai
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Agar pehle se login hai, toh data safe rahega
    const storedUser = localStorage.getItem('trinetra_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
