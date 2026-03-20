const fileStorage = require("../config/fileStorage");

class NoteService {
  async createNote(noteData) {
    return fileStorage.createNote(noteData);
  }

  async getAllNotes() {
    return fileStorage.getAllNotes();
  }

  async updateNote(id, noteData) {
    return fileStorage.updateNote(id, noteData);
  }

  async deleteNote(id) {
    return fileStorage.deleteNote(id);
  }
}

module.exports = new NoteService();
