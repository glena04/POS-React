import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Login.css';

const Unauthorized = () => {
    return (
        <div className="unauthorized-container">
            <h2>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
            <p>Please contact an administrator if you believe this is an error.</p>
            <Link to="/" className="back-button">
                Return to Home
            </Link>
        </div>
    );
};

export default Unauthorized;
