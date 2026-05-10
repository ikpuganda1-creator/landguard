const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 1. Initialize Database
const db = new sqlite3.Database('./landguard.db', (err) => {
    if (err) console.error("Database error:", err.message);
    console.log('Connected to the LandGuard database.');
});

// 2. Create Tables
db.serialize(() => {
    // Table for LandGuard Map Plots
    db.run(`CREATE TABLE IF NOT EXISTS plots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_name TEXT,
        coordinates TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table for Property Inquiries
    db.run(`CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        type TEXT,
        location TEXT,
        budget TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

/* --- LANDGUARD ROUTES --- */

// Save a new plot from the map
app.post('/save-plot', (req, res) => {
    const { owner, points } = req.body;
    const sql = `INSERT INTO plots (owner_name, coordinates) VALUES (?, ?)`;
    db.run(sql, [owner, JSON.stringify(points)], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Plot secured!", id: this.lastID });
    });
});

// Get all plots to display on map
app.get('/plots', (req, res) => {
    db.all("SELECT * FROM plots", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/* --- PROPERTY INQUIRY ROUTES --- */

// Save a new inquiry from the form
app.post('/save-inquiry', (req, res) => {
    const { name, phone, type, loc, budget } = req.body;
    const sql = `INSERT INTO inquiries (name, phone, type, location, budget) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, phone, type, loc, budget], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Inquiry received!", id: this.lastID });
    });
});

// Get all inquiries (For your internal admin use later)
app.get('/inquiries', (req, res) => {
    db.all("SELECT * FROM inquiries ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`
    ============================================
    LANDMARKET ECOSYSTEM ACTIVE
    Server running at: http://localhost:${port}
    - LandGuard: Active
    - Inquiries: Active
    ============================================
    `);
});