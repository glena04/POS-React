import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/App.css";

const Products = ({ addItem }) => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the items:", error);
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
        axios.put(`http://localhost:5000/api/products/${item.id}/quantity`, { 
            quantity: item.quantity - 1 
        })
        .then(() => {
            // Refresh product list to show updated quantities
            fetchProducts();
        })
        .catch(error => {
            console.error("Error updating product quantity:", error);
        });
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="products-section">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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