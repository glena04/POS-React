// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // To allow requests from the React frontend

const app = express();
app.use(express.json());  // To handle JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing

// Setup SQLite database
const db = new sqlite3.Database('./database.db');

// Create table for products if not exists
db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL)");



// ✅ Fix: Add a route for "/"
app.get('/', (req, res) => {
    res.send('Server is running! 🚀');
});





// Get all products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add product
app.post('/api/products', (req, res) => {
    const { name, price } = req.body;
    const stmt = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
    stmt.run(name, price, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name, price });
    });
    stmt.finalize();
});

// Delete product by ID
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM products WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Product deleted successfully" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
