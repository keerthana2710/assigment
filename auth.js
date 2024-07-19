// auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database'); // Assuming you have a separate file for database operations

// Register endpoint
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
    if (row) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert user into database
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(500).json({ msg: 'Server error' });
        }

        // Generate JWT token
        const payload = { user: { id: this.lastID } };
        jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      }
    );
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
    if (!row) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, row.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { user: { id: row.id } };
    jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  });
});

module.exports = router;
