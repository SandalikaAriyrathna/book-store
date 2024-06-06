import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`);
            setBooks(response.data);
        };
        fetchBooks();
    }, []);

    return (
        <div>
            <h1>All Books</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        {book.title} by {book.author} - ${book.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;
