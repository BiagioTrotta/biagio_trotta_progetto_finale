import React, { createContext, useState, useContext } from 'react';

// Creo il contesto
const AuthContext = createContext();

// Crea il provider
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Stato per i dettagli dell'utente

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData); // Imposta i dettagli dell'utente
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null); // Rimuove i dettagli dell'utente
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
