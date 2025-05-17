
import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InactivityTimer from '../services/InactivityTimer';
import AxiosInterceptorService from '../services/AxiosInterceptor';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Inactivity timeout - 5 minutes (300,000 ms)
    const INACTIVITY_TIMEOUT = 60000;
    
    // Refs for our services
    const inactivityTimerRef = useRef(null);
    const axiosInterceptorRef = useRef(null);

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

    // Initialize services on mount
    useEffect(() => {
        // Define the logout function that will be passed to services
        const handleLogout = () => {
            setToken(null);
            setCurrentUser(null);
        };
        
        // Initialize the inactivity timer service
        inactivityTimerRef.current = new InactivityTimer(INACTIVITY_TIMEOUT, handleLogout);
        
        // Initialize the axios interceptor service
        axiosInterceptorRef.current = new AxiosInterceptorService(handleLogout);
        axiosInterceptorRef.current.setupInterceptors();
        
        // Cleanup on unmount
        return () => {
            if (inactivityTimerRef.current) {
                inactivityTimerRef.current.stopTimer();
            }
            if (axiosInterceptorRef.current) {
                axiosInterceptorRef.current.removeInterceptors();
            }
        };
    }, []);

    // Manage inactivity timer based on user authentication state
    useEffect(() => {
        if (currentUser) {
            // Start the inactivity timer when user is logged in
            inactivityTimerRef.current.startTimer();
        } else {
            // Stop the timer when user logs out
            inactivityTimerRef.current.stopTimer();
        }
    }, [currentUser]);

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
        // The timer will be stopped in the useEffect that watches currentUser
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
