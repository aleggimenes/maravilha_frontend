import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [userType, setUserType] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState(null);

    async function login(userData, tokenData) {
        try {
            setUser(userData);
            setToken(tokenData);
            setUserType(userData.userType)
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', tokenData);
            setAuthenticated(true);
        } catch (error) {
            setLoginError('Login ou credencial errada');
        }
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthenticated(false);
        window.location.href = '/';
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            setAuthenticated(true);
            setUserType(parsedUser.userType); // Define o userType após setUser
        }
    }, []);

    function setUserAndToken(userData, tokenData) {
        setUser(userData);
        setToken(tokenData);
        setAuthenticated(true);
    }

    useEffect(() => {
        setLoginError(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, authenticated, userType, login, logout, setUserAndToken, loginError }}>
            {children}
        </AuthContext.Provider>
    );
}
