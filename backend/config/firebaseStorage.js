const { db } = require("./firebase");

class FirebaseStorage {
  async createNote(noteData) {
    try {
      const notesRef = db.ref("notes");
      const newNoteRef = notesRef.push();

      const note = {
        title: noteData.title !== undefined ? noteData.title : "",
        content: noteData.content !== undefined ? noteData.content : "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await newNoteRef.set(note);

      return {
        id: newNoteRef.key,
        ...note,
      };
    } catch (error) {
      throw new Error(`Error creating note: ${error.message}`);
    }
  }

  async getAllNotes() {
    try {
      const notesRef = db.ref("notes");
      const snapshot = await notesRef.once("value");
      const data = snapshot.val();

      if (!data) {
        return [];
      }

      const notesList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
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
      const noteRef = db.ref(`notes/${id}`);
      const snapshot = await noteRef.once("value");

      if (!snapshot.exists()) {
        throw new Error("Note not found");
      }

      const currentNote = snapshot.val();
      const updateData = {
        ...currentNote,
        ...noteData,
        updatedAt: Date.now(),
      };

      await noteRef.set(updateData);

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
      const noteRef = db.ref(`notes/${id}`);
      const snapshot = await noteRef.once("value");

      if (!snapshot.exists()) {
        throw new Error("Note not found");
      }

      await noteRef.remove();

      return { id };
    } catch (error) {
      throw new Error(`Error deleting note: ${error.message}`);
    }
  }
}

module.exports = new FirebaseStorage();
