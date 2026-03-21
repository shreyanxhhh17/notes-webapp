// Use Firebase for production (Vercel), file storage for local development
const isProduction =
  process.env.NODE_ENV === "production" || process.env.VERCEL;
const storage = isProduction
  ? require("../config/firebaseStorage")
  : require("../config/fileStorage");

class NoteService {
  async createNote(noteData) {
    return storage.createNote(noteData);
  }

  async getAllNotes() {
    return storage.getAllNotes();
  }

  async updateNote(id, noteData) {
    return storage.updateNote(id, noteData);
  }

  async deleteNote(id) {
    return storage.deleteNote(id);
  }
}

module.exports = new NoteService();
