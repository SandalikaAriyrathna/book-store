const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    availability: Boolean,
    genre: String
});

const purchaseSchema = new mongoose.Schema({
    bookId: mongoose.Schema.Types.ObjectId,
    title: String,
    price: Number,
    purchaseDate: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);

// a) List all available books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error listing books', error });
    }
});

// b) Search for books by title, author, or genre
app.get('/books/search', async (req, res) => {
    try {
        const { query } = req.query;
        const results = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error searching books', error });
    }
});

// c) Get book details by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving book details', error });
    }
});

// d) Create a new book
app.post('/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
});

// e) Update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedBook) {
            res.json(updatedBook);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
});

// f) Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (deletedBook) {
            res.json({ message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
});

// g) Purchase a book by ID and process the payment
app.post('/books/purchase/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (book && book.availability) {
            book.availability = false;
            await book.save();
            const purchaseDetails = new Purchase({
                bookId: book._id,
                title: book.title,
                price: book.price
            });
            await purchaseDetails.save();
            res.json({ message: 'Purchase successful', purchaseDetails });
        } else {
            res.status(400).json({ message: 'Book not available' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing purchase', error });
    }
});

// h) Endpoint to list all purchases
app.get('/purchases', async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error listing purchases', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
