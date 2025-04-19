// AdminPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/AdminPage.css';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProduct = async () => {
        try {
            const newProduct = { 
                name, 
                price: parseFloat(price), 
                quantity: parseInt(quantity) || 0 
            };
            
            await axios.post('http://localhost:5000/api/products', newProduct);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const startEditing = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price.toString());
        setQuantity(product.quantity.toString());
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        resetForm();
    };

    const updateProduct = async () => {
        try {
            const updatedProduct = { 
                name, 
                price: parseFloat(price), 
                quantity: parseInt(quantity) || 0 
            };
            
            await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, updatedProduct);
            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setQuantity('');
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 0) return;
        
        try {
            await axios.put(`http://localhost:5000/api/products/${id}/quantity`, { quantity: newQuantity });
            fetchProducts();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Panel</h1>
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
            <h2 className="product-heading">Product List</h2>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id} className="product-item">
                        <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-price">${product.price.toFixed(2)}</span>
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
        </div>
    );
};

export default AdminPage;

