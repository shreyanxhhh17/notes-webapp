const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// POST /api/notes - Create a new note
router.post('/', noteController.createNote);

// GET /api/notes - Get all notes
router.get('/', noteController.getAllNotes);

// PUT /api/notes/:id - Update a note
router.put('/:id', noteController.updateNote);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', noteController.deleteNote);

module.exports = router;
