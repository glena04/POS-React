import React, { useState, useEffect } from "react";
import axios from "axios";
const Cart = () => {

    let [cartList, setCartList] = useState([]);
    let [preTax, setPreTax] = useState(0.00);
    let [items, setItems] = useState([]);

    const tax = 0.08;

    // Fetch items from the backend when the component mounts
    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the items:", error);
            });
    }, []);



    const calculate = (tempCart) => {
        let tempPreTax = 0;
        for (let i = 0; i < tempCart.length; i++) {
            tempPreTax = tempPreTax + tempCart[i].price;
        }
        setPreTax((preTax) => tempPreTax);
    }


    const addItem = (name, price) => {
        let tempCart = [...cartList];
        
        // Check if item already exists in the cart
        const existingItemIndex = tempCart.findIndex(item => item.name === name);
        
        if (existingItemIndex >= 0) {
            // Item exists, increase quantity
            tempCart[existingItemIndex].quantity += 1;
        } else {
            // Item doesn't exist, add to cart with quantity 1
            tempCart.push({ name, price, quantity: 1 });
        }
    
        setCartList(tempCart);
        calculate(tempCart);
    }
    

    const removeCartItem = (whichItem) => {
        let tempCart = [...cartList];
        
        if (tempCart[whichItem].quantity > 1) {
            // Decrease quantity if more than 1
            tempCart[whichItem].quantity -= 1;
        } else {
            // Remove item if quantity is 1
            tempCart.splice(whichItem, 1);
        }
    
        setCartList(tempCart);
        calculate(tempCart);
    }


    return (
        <div className="row">
        <div className="col-md-6">
          <h2>Items</h2>
      
          {/* Flexbox container for items */}
          <div className="items-container">
            {items.length > 0 ? items.map((item, i) => {
              return (
                <button 
                  type="button" 
                  key={i} 
                  className="item-box"
                  onClick={() => addItem(item.name, item.price)}
                >
                  {item.name + " - $" + item.price}
                </button>
              );
            }) : null}
          </div>
        </div>
      
        <div className="col-md-6">
    <h2>Cart</h2>
    <div className="list-group">
        {cartList.length > 0 ? cartList.map((cartItem, i) => {
            return (
                <li key={i} className="list-group-item">
                    <i className="fa fa-trash pointer" onClick={() => removeCartItem(i)}></i> 
                    <span className="capitalize">{cartItem.name}</span> 
                    <span> x {cartItem.quantity}</span> {/* Display the quantity */}
                </li>
            );
        }) : null}
    </div>

    {cartList.length > 0 ? (
        <ul className="list-unstyled">
            <li>Tax ${tax.toFixed(2)}</li>
            <li><h4>Pre Tax ${preTax.toFixed(2)}</h4></li>
            <li>
                <div className="alert alert-success" role="alert">
                    <h3>Total ${(preTax * tax + preTax).toFixed(2)}</h3>
                </div>
            </li>
        </ul>
    ) : null}
</div>
      </div>
      )
}

export default Cart;