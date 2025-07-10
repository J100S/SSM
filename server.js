const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

// In-memory "database"
const users = {}; // { username: { password } }
const posts = []; // { username, text, timestamp }

// Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (users[username]) {
    return res.status(400).json({ error: 'Username already taken' });
  }
  users[username] = { password };
  res.json({ success: true });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  res.json({ success: true });
});

// Get posts feed
app.get('/api/posts', (req, res) => {
  // Return posts in reverse chronological order
  res.json(posts.slice().reverse());
});

// Create a new post
app.post('/api/posts', (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) {
    return res.status(400).json({ error: 'Username and text required' });
  }
  posts.push({
    username,
    text,
    timestamp: Date.now(),
  });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
