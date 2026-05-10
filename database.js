const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./land.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS plots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_name TEXT,
        coordinates TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;