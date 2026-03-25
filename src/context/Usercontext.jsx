// File: src/context/UserContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Context बनाना
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        // यहाँ लोकल स्टोरेज में भी सेव कर सकते हैं ताकि रिफ्रेश होने पर लॉगिन रहे
        localStorage.setItem('trinetra_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('trinetra_user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// कस्टम हुक ताकि किसी भी फाइल में यूज़र डेटा आसानी से मिल सके
export const useUser = () => useContext(UserContext);
