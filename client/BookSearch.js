import React, { useState } from 'react';
import axios from 'axios';

const BookSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/search?q=${query}`);
        setResults(response.data);
    };

    return (
        <div>
            <h1>Search Books</h1>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search by title, author, or genre"
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map(book => (
                    <li key={book.id}>
                        {book.title} by {book.author} - ${book.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookSearch;
