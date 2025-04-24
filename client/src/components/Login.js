import React, { useState, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../CSS/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [formError, setFormError] = useState('');
    const { login, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, password } = formData;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setFormError('');

        // Validate form
        if (!username || !password) {
            setFormError('Please enter both username and password');
            return;
        }

        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            // Error is already set in the AuthContext
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h2>Login to POS System</h2>
                
                {(formError || error) && (
                    <div className="auth-error">
                        {formError || error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <button type="submit" className="auth-button">
                        Login
                    </button>
                </form>
                
                {/* Registration link removed - now only available through admin */}
            </div>
        </div>
    );
};

export default Login;
