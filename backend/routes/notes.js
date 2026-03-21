const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// GET /api/notes
router.get('/', noteController.getAllNotes);

// POST /api/notes
router.post('/', noteController.createNote);

// PUT /api/notes/:id
router.put('/:id', noteController.updateNote);

// DELETE /api/notes/:id
router.delete('/:id', noteController.deleteNote);

module.exports = router;