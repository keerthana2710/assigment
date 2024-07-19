const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (!row) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = bcrypt.compareSync(password, row.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { user: { id: row.id } };
    jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
    if (row) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert new user into database
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Server error' });
        }

        // Generate JWT token
        const payload = { user: { id: this.lastID } };
        jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      }
    );
  });
});

module.exports = router;
