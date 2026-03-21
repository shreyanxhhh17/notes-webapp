const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// POST /api/notes - Create a new note
router.post('/api/notes', noteController.createNote);

// GET /api/notes - Get all notes
router.get('/api/notes', noteController.getAllNotes);

// PUT /api/notes/:id - Update a note
router.put('/api/notes/:id', noteController.updateNote);

// DELETE /api/notes/:id - Delete a note
router.delete('/api/notes/:id', noteController.deleteNote);

module.exports = router;
