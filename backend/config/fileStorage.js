const fs = require("fs");
const path = require("path");

const NOTES_FILE = path.join(__dirname, "../data/notes.json");
const DATA_DIR = path.join(__dirname, "../data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load notes from file
const loadNotes = () => {
  try {
    if (fs.existsSync(NOTES_FILE)) {
      const data = fs.readFileSync(NOTES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading notes:", error);
  }
  return {};
};

// Save notes to file
const saveNotes = (notes) => {
  try {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving notes:", error);
    throw error;
  }
};

class FileStorage {
  async createNote(noteData) {
    try {
      const notes = loadNotes();
      const id = Date.now().toString();
      // Changed: Allow empty titles instead of defaulting to "Untitled Note"
      // This prevents the "U" character issue when autosaving incomplete notes
      const note = {
        title: noteData.title !== undefined ? noteData.title : "",
        content: noteData.content !== undefined ? noteData.content : "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      notes[id] = note;
      saveNotes(notes);

      return {
        id,
        ...note,
      };
    } catch (error) {
      throw new Error(`Error creating note: ${error.message}`);
    }
  }

  async getAllNotes() {
    try {
      const notes = loadNotes();
      const notesList = Object.keys(notes).map((key) => ({
        id: key,
        ...notes[key],
      }));

      // Sort by createdAt descending
      notesList.sort((a, b) => b.createdAt - a.createdAt);

      return notesList;
    } catch (error) {
      throw new Error(`Error fetching notes: ${error.message}`);
    }
  }

  async updateNote(id, noteData) {
    try {
      const notes = loadNotes();

      if (!notes[id]) {
        throw new Error("Note not found");
      }

      const updateData = {
        ...notes[id],
        ...noteData,
        updatedAt: Date.now(),
      };

      notes[id] = updateData;
      saveNotes(notes);

      return {
        id,
        ...updateData,
      };
    } catch (error) {
      throw new Error(`Error updating note: ${error.message}`);
    }
  }

  async deleteNote(id) {
    try {
      const notes = loadNotes();

      if (!notes[id]) {
        throw new Error("Note not found");
      }

      delete notes[id];
      saveNotes(notes);

      return { id };
    } catch (error) {
      throw new Error(`Error deleting note: ${error.message}`);
    }
  }
}

module.exports = new FileStorage();
