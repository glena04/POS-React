import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../CSS/Navbar.css';

const Navbar = () => {
    const { currentUser, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    POS System
                </Link>

                <div className="navbar-links">
                    {currentUser ? (
                        <>
                            <Link to="/" className="nav-link">
                                POS
                            </Link>
                            
                            {isAdmin() && (
                                <Link to="/admin" className="nav-link">
                                    Admin
                                </Link>
                            )}
                            
                            <div className="nav-user-info">
                                <span className="username">
                                    {currentUser.username}
                                    <span className="role-badge">
                                        {currentUser.role}
                                    </span>
                                </span>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/info" className="nav-link">
                                Info
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
