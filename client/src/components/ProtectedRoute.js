import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// ProtectedRoute component to handle route protection based on authentication and roles
const ProtectedRoute = ({ requireAdmin }) => {
    const { currentUser, loading, isAdmin } = useContext(AuthContext);

    // If still loading, show a loading indicator
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // If admin role is required but user is not admin, redirect to unauthorized
    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated and authorized, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
