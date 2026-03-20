const { db } = require('../config/firebase');

class NoteService {
  async createNote(noteData) {
    try {
      const note = {
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const newNoteRef = db.ref('notes').push();
      await newNoteRef.set(note);
      
      return {
        id: newNoteRef.key,
        ...note
      };
    } catch (error) {
      throw new Error(`Error creating note: ${error.message}`);
    }
  }

  async getAllNotes() {
    try {
      const snapshot = await db.ref('notes').once('value');
      const notesData = snapshot.val();
      
      if (!notesData) {
        return [];
      }

      const notes = Object.keys(notesData).map(key => ({
        id: key,
        ...notesData[key]
      }));

      // Sort by createdAt descending
      notes.sort((a, b) => b.createdAt - a.createdAt);

      return notes;
    } catch (error) {
      throw new Error(`Error fetching notes: ${error.message}`);
    }
  }

  async updateNote(id, noteData) {
    try {
      const noteRef = db.ref(`notes/${id}`);
      const snapshot = await noteRef.once('value');
      
      if (!snapshot.exists()) {
        throw new Error('Note not found');
      }

      const updateData = {
        ...noteData,
        updatedAt: Date.now()
      };

      await noteRef.update(updateData);
      
      const updatedSnapshot = await noteRef.once('value');
      
      return {
        id: id,
        ...updatedSnapshot.val()
      };
    } catch (error) {
      throw new Error(`Error updating note: ${error.message}`);
    }
  }

  async deleteNote(id) {
    try {
      const noteRef = db.ref(`notes/${id}`);
      const snapshot = await noteRef.once('value');

      if (!snapshot.exists()) {
        throw new Error('Note not found');
      }

      await noteRef.remove();
      return { id };
    } catch (error) {
      throw new Error(`Error deleting note: ${error.message}`);
    }
  }
}

module.exports = new NoteService();
