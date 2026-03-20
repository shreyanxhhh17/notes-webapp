const noteService = require("../services/noteService");

class NoteController {
  async createNote(req, res) {
    try {
      const { title, content } = req.body;

      // Allow empty notes - the service will provide defaults
      const note = await noteService.createNote({ title, content });
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllNotes(req, res) {
    try {
      const notes = await noteService.getAllNotes();
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      // Allow updates where at least one field is provided
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;

      // Only reject if no fields are being updated
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: "At least title or content must be provided",
        });
      }

      const note = await noteService.updateNote(id, updateData);
      res.status(200).json(note);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const result = await noteService.deleteNote(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = new NoteController();
