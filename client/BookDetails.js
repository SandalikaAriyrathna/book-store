import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/${id}`);
            setBook(response.data);
        };
        fetchBook();
    }, [id]);

    const handlePurchase = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/books/purchase/${id}`);
        alert('Purchase successful');
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <h1>{book.title}</h1>
            <p>{book.author}</p>
            <p>${book.price}</p>
            <button onClick={handlePurchase}>Purchase</button>
        </div>
    );
};

export default BookDetails;
