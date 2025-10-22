const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// In-memory stores for demo purposes
const users = new Map(); // key: email, value: { id, username, email, passwordHash, profile }
const sessions = new Map(); // key: token, value: email
const moods = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/signup', (req, res) => {
  const { username, email, password, age, married, employment } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const id = uuidv4();
  const user = { id, username, email, passwordHash: password, profile: { age, married, employment } };
  users.set(email, user);
  return res.json({ id, username, email });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = users.get(email);
  if (!user || user.passwordHash !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = uuidv4();
  sessions.set(token, email);
  return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

app.post('/api/mood', (req, res) => {
  const { token, emotion } = req.body;
  const email = sessions.get(token);
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const record = { id: uuidv4(), email, emotion, createdAt: new Date().toISOString() };
  moods.push(record);
  return res.json(record);
});

app.get('/api/moods', (req, res) => {
  res.json(moods);
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
