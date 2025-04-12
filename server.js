// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Setup SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create table if it doesn't exist (without dropping existing table)
db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL)", (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Products table created or already exists");
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT id, name, price FROM products", [], (err, rows) => {
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