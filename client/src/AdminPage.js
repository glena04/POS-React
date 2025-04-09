// AdminPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            fetchProducts();  // Refresh product list
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();  // Refresh product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className='AdminPage'>
            <h1>Admin Page</h1>
            <div>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Product Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <button onClick={addProduct}>Add Product</button>
            </div>
            <h2>Products</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{product.name} - ${product.price}</span>
                    <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
