const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// SQLite DB setup
const DB_PATH = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT,
    age INTEGER,
    married TEXT,
    employment TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    email TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS moods (
    id TEXT PRIMARY KEY,
    email TEXT,
    emotion TEXT,
    createdAt TEXT
  )`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/signup', (req, res) => {
  const { username, email, password, age, married, employment } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO users (id, username, email, password, age, married, employment) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmt.run(id, username, email, password, age || null, married || null, employment || null, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'User already exists' });
      return res.status(500).json({ error: err.message });
    }
    return res.json({ id, username, email });
  });
  stmt.finalize();
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row || row.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    const token = uuidv4();
    const createdAt = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO sessions (token, email, createdAt) VALUES (?, ?, ?)');
    stmt.run(token, email, createdAt, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      return res.json({ token, user: { id: row.id, username: row.username, email: row.email } });
    });
    stmt.finalize();
  });
});

app.post('/api/mood', (req, res) => {
  const { token, emotion } = req.body;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  db.get('SELECT email FROM sessions WHERE token = ?', [token], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Unauthorized' });
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO moods (id, email, emotion, createdAt) VALUES (?, ?, ?, ?)');
    stmt.run(id, row.email, emotion, createdAt, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      return res.json({ id, email: row.email, emotion, createdAt });
    });
    stmt.finalize();
  });
});

app.get('/api/moods', (req, res) => {
  db.all('SELECT * FROM moods ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
