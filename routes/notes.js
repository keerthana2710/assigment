const express = require('express');
const router = express.Router();
const db = require('../database');

// Add new note
router.post('/', async (req, res) => {
  const { title, desc } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO notes (title, description) VALUES (?, ?)',
      [title, desc]
    );
    const newNote = {
      id: result.lastID,
      title,
      desc
    };
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await db.all('SELECT * FROM notes');
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
