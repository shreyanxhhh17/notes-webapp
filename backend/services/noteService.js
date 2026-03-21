// Use Firebase for all environments
const { db } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

class NoteService {
  async createNote(noteData) {
    try {
      const note = {
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('notes').add(note);
      const newNote = await docRef.get();
      
      return {
        id: docRef.id,
        ...newNote.data()
      };
    } catch (error) {
      throw new Error(`Error creating note: ${error.message}`);
    }
  }

  async getAllNotes() {
    try {
      const snapshot = await db.collection('notes')
        .orderBy('createdAt', 'desc')
        .get();
      
      const notes = [];
      snapshot.forEach(doc => {
        notes.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return notes;
    } catch (error) {
      throw new Error(`Error fetching notes: ${error.message}`);
    }
  }

  async updateNote(id, noteData) {
    try {
      const updateData = {
        ...noteData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('notes').doc(id).update(updateData);
      
      const updatedNote = await db.collection('notes').doc(id).get();
      
      if (!updatedNote.exists) {
        throw new Error('Note not found');
      }

      return {
        id: id,
        ...updatedNote.data()
      };
    } catch (error) {
      throw new Error(`Error updating note: ${error.message}`);
    }
  }

  async deleteNote(id) {
    try {
      const noteRef = db.collection('notes').doc(id);
      const note = await noteRef.get();

      if (!note.exists) {
        throw new Error('Note not found');
      }

      await noteRef.delete();
      return { id };
    } catch (error) {
      throw new Error(`Error deleting note: ${error.message}`);
    }
  }
}

module.exports = new NoteService();
