import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../CSS/App.css";
//import { AuthContext } from "../context/AuthContext";

const Products = ({ addItem }) => {
    // We're not using currentUser directly, so we can remove it from the destructuring
    //const { } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        setError(null);
        
        axios.get(`${API_URL}/products`)
            .then(response => {
                setItems(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the items:", error);
                setError("Failed to load products. Please try again.");
                setLoading(false);
            });
    };

    const handleAddToCart = (item) => {
        // Check if item is in stock
        if (item.quantity <= 0) {
            alert(`Sorry, ${item.name} is out of stock!`);
            return;
        }
        
        // Call the addItem function and update product quantity in database
        addItem(item.id, item.name, item.price);
        
        // Update the stock quantity in the database
        axios.put(`${API_URL}/products/${item.id}/quantity`, { 
            quantity: item.quantity - 1 
        })
        .then(() => {
            // Refresh product list to show updated quantities
            fetchProducts();
        })
        .catch(error => {
            console.error("Error updating product quantity:", error);
            if (error.response && error.response.status === 401) {
                alert("Your session has expired. Please login again.");
            }
        });
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="products-section loading">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-section error">
                <p className="error-message">{error}</p>
                <button onClick={fetchProducts} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="products-section">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchProducts} className="refresh-button">
                    Refresh
                </button>
            </div>
            
            <div className="products-grid">
                {filteredItems.length > 0 ? filteredItems.map((item, i) => (
                    <div 
                        key={i} 
                        className={`product-card ${item.quantity <= 0 ? 'out-of-stock' : ''}`}
                        onClick={() => handleAddToCart(item)}
                    >
                        <div className="product-content">
                            <div className="product-name">{item.name}</div>
                            <div className="product-price">${item.price.toFixed(2)}</div>
                            <div className="product-stock">
                                Stock: <span className={item.quantity <= 0 ? 'no-stock' : ''}>{item.quantity}</span>
                            </div>
                        </div>
                    </div>
                )) : <p className="no-products">No products found</p>}
            </div>
        </div>
    );
};

export default Products;
