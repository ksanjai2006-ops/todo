const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');

// Sign up - create own password
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  if (!db.users) db.users = [];

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: 'user-' + (db.users.length + 1) + '-' + Date.now(),
    name: name || email.split('@')[0],
    email: email.trim(),
    password: password.trim() // store password
  };

  db.users.push(newUser);
  writeDb(db);

  // Return user without password
  const { password: _, ...userSafe } = newUser;
  return res.status(201).json({ user: userSafe, message: 'Account created successfully' });
});

// Sign In
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const user = (db.users || []).find(
    u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password.trim()
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userSafe } = user;
  return res.json({ user: userSafe, message: 'Logged in successfully' });
});

// Get current user list or me
router.get('/me', (req, res) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });
  const defaultUser = (db.users && db.users[0]) || { id: 'user-1', name: 'Denise', email: 'denise@example.com' };
  const { password: _, ...userSafe } = defaultUser;
  res.json({ user: userSafe });
});

module.exports = router;
