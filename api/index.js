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

// c) Purchase a book by ID and process the payment
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

// Endpoint to list all purchases
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
