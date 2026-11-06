
const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: 'root',
    database: 'bookstore'
});

db.connect(err => {
    if (err) {
        console.log('Database connection failed:', err.message);
        return;
    }
    console.log('MySQL Connected Successfully!');
});

// View all books
app.get('/books', (req, res) => {
    db.query('SELECT * FROM book', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Add a book
app.post('/books', (req, res) => {
    const b = req.body;
    const sql = `INSERT INTO book
        (title, author, category, prices, stock)
        VALUES (?, ?, ?, ?, ?)`;

    db.query(sql,
        [b.title, b.author, b.category, b.prices, b.stock],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Book added successfully!' });
        });
});

// Update a book
app.put('/books/:id', (req, res) => {
    const b = req.body;
    const sql = `UPDATE book SET title=?, author=?,
        category=?, prices=?, stock=? WHERE book_id=?`;

    db.query(sql,
        [b.title, b.author, b.category, b.prices, b.stock, req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send('Book ID not found');
            res.json({ message: 'Book updated successfully!' });
        });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    db.query('DELETE FROM book WHERE book_id=?',
        [req.params.id], (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0)
                return res.status(404).send('Book ID not found');
            res.json({ message: 'Book deleted successfully!' });
        });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
