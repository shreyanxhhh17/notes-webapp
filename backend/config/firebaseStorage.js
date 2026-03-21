const { db } = require("./firebase");

// Helper function to add timeout to promises
const withTimeout = (promise, timeoutMs = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(`Firebase operation timed out after ${timeoutMs}ms`),
          ),
        timeoutMs,
      ),
    ),
  ]);
};

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

      await withTimeout(newNoteRef.set(note));

      return {
        id: newNoteRef.key,
        ...note,
      };
    } catch (error) {
      console.error("❌ Error creating note:", error);
      throw new Error(`Error creating note: ${error.message}`);
    }
  }

  async getAllNotes() {
    try {
      console.log("📖 Fetching notes from Firebase...");
      const notesRef = db.ref("notes");
      const snapshot = await withTimeout(notesRef.once("value"), 8000);
      const data = snapshot.val();

      if (!data) {
        console.log("✅ No notes found, returning empty array");
        return [];
      }

      const notesList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      // Sort by createdAt descending
      notesList.sort((a, b) => b.createdAt - a.createdAt);
      console.log(`✅ Fetched ${notesList.length} notes`);
      return notesList;
    } catch (error) {
      console.error("❌ Error fetching notes:", error);
      throw new Error(`Error fetching notes: ${error.message}`);
    }
  }

  async updateNote(id, noteData) {
    try {
      const noteRef = db.ref(`notes/${id}`);
      const snapshot = await withTimeout(noteRef.once("value"));

      if (!snapshot.exists()) {
        throw new Error("Note not found");
      }

      const currentNote = snapshot.val();
      const updateData = {
        ...currentNote,
        ...noteData,
        updatedAt: Date.now(),
      };

      await withTimeout(noteRef.set(updateData));

      return {
        id,
        ...updateData,
      };
    } catch (error) {
      console.error("❌ Error updating note:", error);
      throw new Error(`Error updating note: ${error.message}`);
    }
  }

  async deleteNote(id) {
    try {
      const noteRef = db.ref(`notes/${id}`);
      const snapshot = await withTimeout(noteRef.once("value"));

      if (!snapshot.exists()) {
        throw new Error("Note not found");
      }

      await withTimeout(noteRef.remove());

      return { id };
    } catch (error) {
      console.error("❌ Error deleting note:", error);
      throw new Error(`Error deleting note: ${error.message}`);
    }
  }
}

module.exports = new FirebaseStorage();
