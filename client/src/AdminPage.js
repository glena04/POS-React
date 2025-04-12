// AdminPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/AdminPage.css'; // 👈 Make sure this CSS file exists

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

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
            const newProduct = { name, price: parseFloat(price) };
            await axios.post('http://localhost:5000/api/products', newProduct);
            setName('');
            setPrice('');
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
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
                />
                <button onClick={addProduct} className="add-button">Add Product</button>
            </div>
            <h2 className="product-heading">Product List</h2>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id} className="product-item">
                        <span>{product.name} - ${product.price}</span>
                        <button onClick={() => deleteProduct(product.id)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;

