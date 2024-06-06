import React, { useState } from 'react';

const ShoppingCart = () => {
    const [cart, setCart] = useState([]);

    const addToCart = (book) => {
        setCart([...cart, book]);
    };

    const handleCheckout = () => {
        // Handle checkout logic
        alert('Checkout complete');
        setCart([]);
    };

    return (
        <div>
            <h1>Shopping Cart</h1>
            <ul>
                {cart.map((book, index) => (
                    <li key={index}>{book.title} by {book.author} - ${book.price}</li>
                ))}
            </ul>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default ShoppingCart;
