// AdminPage.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './CSS/AdminPage.css';
import { AuthContext } from './context/AuthContext';

const AdminPage = () => {
    // We're using currentUser but not isAdmin directly
    const { currentUser } = useContext(AuthContext);
    
    // Product state
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // User management state
    const [users, setUsers] = useState([]);
    const [userFormData, setUserFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // Default role
    });
    const [userFormError, setUserFormError] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'users'

    const API_URL = process.env.REACT_APP_API_URL;

    // Handle tab switching
    const switchTab = (tab) => {
        setActiveTab(tab);
        if (tab === 'users' && users.length === 0) {
            fetchUsers();
        }
    };

    useEffect(() => {
        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            setUserFormError('');
            const response = await axios.get(`${API_URL}/auth/users`);
            setUsers(response.data);
            setLoadingUsers(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUserFormError('Failed to load users. Please try again.');
            setLoadingUsers(false);
            
            if (error.response && error.response.status === 401) {
                setUserFormError('Your session has expired. Please login again.');
            } else if (error.response && error.response.status === 403) {
                setUserFormError('You do not have permission to view users.');
            }
        }
    };

    // Handle user form input changes
    const handleUserFormChange = (e) => {
        setUserFormData({
            ...userFormData,
            [e.target.name]: e.target.value
        });
    };

    // Reset user form
    const resetUserForm = () => {
        setUserFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user'
        });
        setUserFormError('');
    };

    // Register a new user
    const registerUser = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword, role } = userFormData;
        
        // Validate form
        if (!username || !email || !password || !confirmPassword) {
            setUserFormError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            setUserFormError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            setUserFormError('Password must be at least 6 characters');
            return;
        }
        
        try {
            setUserFormError('');
            setLoadingUsers(true);
            
            // Use the register function from AuthContext but don't login as the new user
            await axios.post(`${API_URL}/auth/register`, { 
                username, 
                email, 
                password,
                role
            });
            
            resetUserForm();
            fetchUsers();
            setLoadingUsers(false);
        } catch (error) {
            console.error('Error registering user:', error);
            setLoadingUsers(false);
            
            if (error.response && error.response.data && error.response.data.error) {
                setUserFormError(error.response.data.error);
            } else {
                setUserFormError('Failed to register user. Please try again.');
            }
        }
    };
    
    // Delete a user
    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        
        try {
            setUserFormError('');
            await axios.delete(`${API_URL}/auth/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            
            // Always refresh the user list to ensure UI is up-to-date
            fetchUsers();
            
            if (error.response && error.response.status === 404) {
                setUserFormError(`User (ID: ${userId}) not found. The user may have already been deleted.`);
            } else if (error.response && error.response.status === 401) {
                setUserFormError('Your session has expired. Please login again.');
            } else if (error.response && error.response.status === 403) {
                setUserFormError('You do not have permission to delete users.');
            } else {
                setUserFormError('Failed to delete user. Please try again.');
            }
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again.');
            setLoading(false);
            
            if (error.response && error.response.status === 401) {
                setError('Your session has expired. Please login again.');
            }
        }
    };

    const addProduct = async () => {
        try {
            if (!name || !price) {
                setError('Product name and price are required');
                return;
            }

            setError(null);
            const newProduct = { 
                name, 
                price: parseFloat(price), 
                quantity: parseInt(quantity) || 0 
            };
            
            await axios.post(`${API_URL}/products`, newProduct);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            
            if (error.response && error.response.status === 401) {
                setError('Your session has expired. Please login again.');
            } else if (error.response && error.response.status === 403) {
                setError('You do not have permission to add products.');
            } else {
                setError('Failed to add product. Please try again.');
            }
        }
    };

    const startEditing = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price.toString());
        setQuantity(product.quantity.toString());
        setError(null);
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        resetForm();
        setError(null);
    };

    const updateProduct = async () => {
        try {
            if (!name || !price) {
                setError('Product name and price are required');
                return;
            }

            setError(null);
            const updatedProduct = { 
                name, 
                price: parseFloat(price), 
                quantity: parseInt(quantity) || 0 
            };
            
            await axios.put(`${API_URL}/products/${editingProduct.id}`, updatedProduct);
            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            
            if (error.response && error.response.status === 401) {
                setError('Your session has expired. Please login again.');
            } else if (error.response && error.response.status === 403) {
                setError('You do not have permission to update products.');
            } else {
                setError('Failed to update product. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setQuantity('');
        setError(null);
    };

    const deleteProduct = async (id) => {
        try {
            setError(null);
            await axios.delete(`${API_URL}/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            
            if (error.response && error.response.status === 401) {
                setError('Your session has expired. Please login again.');
            } else if (error.response && error.response.status === 403) {
                setError('You do not have permission to delete products.');
            } else {
                setError('Failed to delete product. Please try again.');
            }
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 0) return;
        
        try {
            setError(null);
            await axios.put(`${API_URL}/products/${id}/quantity`, { quantity: newQuantity });
            fetchProducts();
        } catch (error) {
            console.error('Error updating quantity:', error);
            
            if (error.response && error.response.status === 401) {
                setError('Your session has expired. Please login again.');
            } else {
                setError('Failed to update quantity. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-container loading">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Panel</h1>
            {currentUser && (
                <div className="admin-welcome">
                    Welcome, {currentUser.username} ({currentUser.role})
                </div>
            )}
            
            {/* Tab Navigation */}
            <div className="admin-tabs">
                <button 
                    className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => switchTab('products')}
                >
                    Manage Products
                </button>
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => switchTab('users')}
                >
                    Manage Users
                </button>
            </div>
            
            {/* Product Management Section */}
            {activeTab === 'products' && (
                <div className="products-section">
                    {error && (
                        <div className="admin-error">
                            {error}
                        </div>
                    )}
                    
                    <div className="form-section">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="admin-input"
                        />
                        <input
                            type="number"
                            placeholder="Product Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="admin-input"
                            step="0.01"
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Quantity in Stock"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="admin-input"
                            min="0"
                        />
                        {editingProduct ? (
                            <div className="button-group">
                                <button onClick={updateProduct} className="update-button">Update Product</button>
                                <button onClick={cancelEditing} className="cancel-button">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={addProduct} className="add-button">Add Product</button>
                        )}
                    </div>
                    
                    <div className="product-header">
                        <h2 className="product-heading">Product List</h2>
                        <button onClick={fetchProducts} className="refresh-button">
                            Refresh
                        </button>
                    </div>
                    
                    {products.length === 0 ? (
                        <p className="no-products">No products found</p>
                    ) : (
                        <ul className="product-list">
                            {products.map((product) => (
                                <li key={product.id} className="product-item">
                                    <div className="product-info">
                                        <span className="product-names">{product.name}</span>
                                        <span className="product-prices">${product.price.toFixed(2)}</span>
                                    </div>
                                    <div className="quantity-control">
                                        <span>Stock: </span>
                                        <button 
                                            className="quantity-btn" 
                                            onClick={() => updateQuantity(product.id, Math.max(0, product.quantity - 1))}
                                        >
                                            -
                                        </button>
                                        <span className="stock-quantity">{product.quantity}</span>
                                        <button 
                                            className="quantity-btn" 
                                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="action-buttons">
                                        <button onClick={() => startEditing(product)} className="edit-button">Edit</button>
                                        <button onClick={() => deleteProduct(product.id)} className="delete-button">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            
            {/* User Management Section */}
            {activeTab === 'users' && (
                <div className="users-section">
                    {userFormError && (
                        <div className="admin-error">
                            {userFormError}
                        </div>
                    )}
                    
                    <div className="form-section">
                        <h3>Add New User</h3>
                        <form onSubmit={registerUser} className="user-form">
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={userFormData.username}
                                onChange={handleUserFormChange}
                                className="admin-input"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={userFormData.email}
                                onChange={handleUserFormChange}
                                className="admin-input"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={userFormData.password}
                                onChange={handleUserFormChange}
                                className="admin-input"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={userFormData.confirmPassword}
                                onChange={handleUserFormChange}
                                className="admin-input"
                            />
                            <select
                                name="role"
                                value={userFormData.role}
                                onChange={handleUserFormChange}
                                className="admin-input"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" className="add-button">
                                Register User
                            </button>
                        </form>
                    </div>
                    
                    <div className="product-header">
                        <h2 className="product-heading">User List</h2>
                        <button onClick={fetchUsers} className="refresh-button">
                            Refresh
                        </button>
                    </div>
                    
                    {loadingUsers ? (
                        <div className="loading-spinner"></div>
                    ) : users.length === 0 ? (
                        <p className="no-products">No users found</p>
                    ) : (
                        <ul className="user-list">
                            {users.map((user) => (
                                <li key={user.id} className="user-item">
                                    <div className="user-info">
                                        <span className="user-name">{user.username}</span>
                                        <span className="user-email">{user.email}</span>
                                        <span className="user-role">{user.role}</span>
                                    </div>
                                    <div className="action-buttons">
                                        <button 
                                            onClick={() => deleteUser(user.id)} 
                                            className="delete-button"
                                            disabled={user.id === currentUser.id} // Prevent deleting your own account
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
