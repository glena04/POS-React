import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/App.css";

const Products = ({ addItem }) => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the items.:", error);
            });
    }, []);

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
                        className="product-card"
                        onClick={() => addItem(item.name, item.price)}
                    >
                        <div className="product-content">
                            <div className="product-name">{item.name}</div>
                            <div className="product-price">${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                )) : <p className="no-products">No products found</p>}
            </div>
        </div>
    );
};

export default Products;