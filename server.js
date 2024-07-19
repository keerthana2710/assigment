const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // Middleware to parse request body
const app = express();

const PORT = process.env.PORT || 3000; // Define the PORT variable here

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON bodies for POST requests

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the login.html file
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve the register.html file
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle user login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { default: fetch } = await import('node-fetch');

    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    res.json(data); // Forward response from backend to client
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Handle user registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { default: fetch } = await import('node-fetch');

    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    res.json(data); // Forward response from backend to client
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
