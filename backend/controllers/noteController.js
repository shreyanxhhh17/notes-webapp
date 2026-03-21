const noteService = require("../services/noteService");

class NoteController {
  async createNote(req, res) {
    try {
      const { title, content } = req.body;

      // Sanitize inputs - ensure they're strings and trim whitespace
      const sanitizedTitle = typeof title === "string" ? title.trim() : "";
      const sanitizedContent =
        typeof content === "string" ? content.trim() : "";

      const note = await noteService.createNote({
        title: sanitizedTitle,
        content: sanitizedContent,
      });
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllNotes(req, res) {
    try {
      const notes = await noteService.getAllNotes();
      res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      // Sanitize inputs - ensure they're strings and don't corrupt
      const updateData = {};

      if (title !== undefined) {
        const sanitizedTitle = typeof title === "string" ? title.trim() : "";
        updateData.title = sanitizedTitle;
      }

      if (content !== undefined) {
        const sanitizedContent =
          typeof content === "string" ? content.trim() : "";
        updateData.content = sanitizedContent;
      }

      // Only reject if no fields are being updated
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: "At least title or content must be provided",
        });
      }

      const note = await noteService.updateNote(id, updateData);
      res.status(200).json(note);
    } catch (error) {
      console.error("Error updating note:", error);
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
      console.error("Error deleting note:", error);
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = new NoteController();
