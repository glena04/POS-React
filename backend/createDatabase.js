const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Error opening database: " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  // Create products table
  db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, itemName TEXT, price REAL)");

  // Insert sample data (optional)
  const stmt = db.prepare("INSERT INTO products (itemName, price) VALUES (?, ?)");
  stmt.run("ice", 2.99);
  stmt.run("salt", 1.95);
  stmt.run("plates", 4.90);
  stmt.run("firewood", 6.25);
  stmt.run("matches", 0.99);
  stmt.finalize();
});

db.close();
