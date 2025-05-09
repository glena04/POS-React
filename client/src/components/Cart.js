import React, { useState, useContext } from "react";
import axios from "axios";
import "../CSS/App.css";
import { calculate } from "../Util";
import Products from "./Products";
import { AuthContext } from "../context/AuthContext";

const Cart = () => {
    const { currentUser } = useContext(AuthContext);
    const [cartList, setCartList] = useState([]);
    const [preTax, setPreTax] = useState(0.00);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [receipt, setReceipt] = useState(null);

    const tax = 0.08;
    const API_URL = process.env.REACT_APP_API_URL;

    const addItem = (id, name, price) => {
        let tempCart = [...cartList];
        
        const existingItemIndex = tempCart.findIndex(item => item.name === name);
        
        if (existingItemIndex >= 0) {
            tempCart[existingItemIndex].quantity += 1;
        } else {
            tempCart.push({ id, name, price, quantity: 1 });
        }
    
        setCartList(tempCart);
        setPreTax(calculate(tempCart));
    }
    
    const removeCartItem = (index) => {
        let tempCart = [...cartList];
        const item = tempCart[index];
        
        if (tempCart[index].quantity > 1) {
            tempCart[index].quantity -= 1;
            
            // Increase product stock in database
            updateProductStock(item.id, 1);
        } else {
            // Increase product stock in database
            updateProductStock(item.id, 1);
            tempCart.splice(index, 1);
        }
    
        setCartList(tempCart);
        setPreTax(calculate(tempCart));
    }

    const increaseQuantity = (index) => {
        let tempCart = [...cartList];
        const item = tempCart[index];
        
        // Check stock availability first.
        axios.get(`${API_URL}/products/${item.id}`)
            .then(response => {
                const product = response.data;
                
                if (product.quantity > 0) {
                    // Update cart
                    tempCart[index].quantity += 1;
                    setCartList(tempCart);
                    setPreTax(calculate(tempCart));
                    
                    // Update product stock in database
                    updateProductStock(item.id, -1);
                } else {
                    alert(`Sorry, ${item.name} is out of stock!`);
                }
            })
            .catch(error => {
                console.error("Error checking product stock:", error);
            });
    }
    
    const updateProductStock = (productId, change) => {
        // Get current product quantity
        axios.get(`${API_URL}/products/${productId}`)
            .then(response => {
                const product = response.data;
                const newQuantity = product.quantity + change;
                
                // Update product quantity with authentication
                axios.put(`${API_URL}/products/${productId}/quantity`, { 
                    quantity: newQuantity 
                })
                .catch(error => {
                    console.error("Error updating product quantity:", error);
                    if (error.response && error.response.status === 401) {
                        alert("Your session has expired. Please login again.");
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching product:", error);
            });
    }

    const clearCart = () => {
        // Return all items to stock
        cartList.forEach(item => {
            updateProductStock(item.id, item.quantity);
        });
        
        setCartList([]);
        setPreTax(0);
        setReceipt(null);
    }

    const handlePayment = (method) => {
        // Create receipt data
        const receiptData = {
            items: cartList,
            subtotal: preTax,
            tax: preTax * tax,
            total: preTax * (1 + tax),
            paymentMethod: method,
            date: new Date().toLocaleString(),
            cashier: currentUser ? currentUser.username : 'Guest'
        };
        
        // Items have already been removed from stock during the cart operations
        // We don't need to update stock here again, just finalize the transaction
        
        setReceipt(receiptData);
        setShowPaymentOptions(false);
    }

    const printReceipt = () => {
        if (!receipt) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body { font-family: monospace; line-height: 1.5; }
                        .receipt { width: 300px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .item { display: flex; justify-content: space-between; }
                        .total { margin-top: 10px; border-top: 1px dashed #000; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <h2>RECEIPT</h2>
                            <p>${receipt.date}</p>
                            <p>Cashier: ${receipt.cashier}</p>
                        </div>
                        <div class="items">
                            ${receipt.items.map(item => `
                                <div class="item">
                                    <span>${item.quantity} x ${item.name}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="summary">
                            <div class="item"><span>Subtotal:</span> <span>$${receipt.subtotal.toFixed(2)}</span></div>
                            <div class="item"><span>Tax (${(tax * 100).toFixed(0)}%):</span> <span>$${receipt.tax.toFixed(2)}</span></div>
                            <div class="item total"><span>Total:</span> <span>$${receipt.total.toFixed(2)}</span></div>
                            <div class="item"><span>Payment Method:</span> <span>${receipt.paymentMethod}</span></div>
                        </div>
                        <div class="header">
                            <p>Thank you for your purchase!</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    return (
        <div className="pos-container">
            <Products addItem={addItem} />
            
            <div className="cart-section">
                <div className="cart-header">
                    <h2>Cart</h2>
                </div>
                
                <div className="cart-items">
                    {cartList.length > 0 ? (
                        cartList.map((cartItem, i) => (
                            <div key={i} className="cart-item">
                                <div className="cart-item-info">
                                    <span className="cart-item-name">{cartItem.name}</span>
                                    <span className="cart-item-price">${cartItem.price.toFixed(2)}</span>
                                </div>
                                <div className="quantity-controls">
                                    <button 
                                        className="quantity-btn minus"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeCartItem(i);
                                        }}
                                    >
                                        –
                                    </button>
                                    <span className="quantity">{cartItem.quantity}</span>
                                    <button 
                                        className="quantity-btn plus"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            increaseQuantity(i);
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-cart">
                            <p>Cart is empty</p>
                        </div>
                    )}
                </div>
                
                {cartList.length > 0 && (
                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${preTax.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax:</span>
                            <span>${(preTax * tax).toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${(preTax * (1 + tax)).toFixed(2)}</span>
                        </div>
                    </div>
                )}
                
                <div className="cart-actions">
                    {!showPaymentOptions && !receipt ? (
                        <>
                            <button 
                                className="action-btn pay-btn"
                                onClick={() => setShowPaymentOptions(true)}
                                disabled={cartList.length === 0}
                            >
                                Pay
                            </button>
                            <button 
                                className="action-btn receipt-btn"
                                onClick={printReceipt}
                                disabled={!receipt}
                            >
                                Receipt
                            </button>
                            <button 
                                className="action-btn clear-btn"
                                onClick={clearCart}
                                disabled={cartList.length === 0}
                            >
                                Clear
                            </button>
                        </>
                    ) : showPaymentOptions ? (
                        <div className="payment-options">
                            <button 
                                className="payment-btn cash"
                                onClick={() => handlePayment('Cash')}
                            >
                                Cash
                            </button>
                            <button 
                                className="payment-btn card"
                                onClick={() => handlePayment('Card')}
                            >
                                Card
                            </button>
                            <button 
                                className="payment-btn cancel"
                                onClick={() => setShowPaymentOptions(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : receipt ? (
                        <div className="receipt-actions">
                            <button 
                                className="action-btn print-btn"
                                onClick={printReceipt}
                            >
                                Print
                            </button>
                            <button 
                                className="action-btn new-sale-btn"
                                onClick={clearCart}
                            >
                                New Sale
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Cart;
