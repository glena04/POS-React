import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set up axios defaults
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;

    // Set token in axios headers and localStorage
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Load user on initial render if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('/auth/profile');
                setCurrentUser(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading user:', err);
                setToken(null);
                setCurrentUser(null);
                setError('Session expired. Please login again.');
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Register user
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.post('/auth/register', userData);
            setToken(res.data.token);
            setCurrentUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.post('/auth/login', userData);
            setToken(res.data.token);
            setCurrentUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = () => {
        setToken(null);
        setCurrentUser(null);
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.put('/auth/profile', userData);
            
            // Refresh user data
            const userRes = await axios.get('/auth/profile');
            setCurrentUser(userRes.data);
            
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Profile update failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Check if user is admin
    const isAdmin = () => {
        return currentUser?.role === 'admin';
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!currentUser;
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                loading,
                error,
                register,
                login,
                logout,
                updateProfile,
                isAdmin,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
