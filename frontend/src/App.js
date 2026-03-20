import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import SearchBar from "./components/SearchBar";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import ToastContainer from "./components/Toast/ToastContainer";
import { noteService } from "./services/noteService";

function AppContent() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const notesPerPage = 10;

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await noteService.getAllNotes();
      setNotes(data);
    } catch (err) {
      showToast("error", "Failed to fetch notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }, [notes, searchQuery]);

  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * notesPerPage;
    const endIndex = startIndex + notesPerPage;
    return filteredNotes.slice(startIndex, endIndex);
  }, [filteredNotes, currentPage, notesPerPage]);

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await noteService.createNote(noteData);
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      showToast("success", "Note created successfully");
    } catch (err) {
      showToast("error", "Failed to create note");
      console.error("Error creating note:", err);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const updatedNote = await noteService.updateNote(id, noteData);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note)),
      );
      // Update selectedNote only to sync server changes, but NoteEditor uses
      // a ref to prevent resetting input fields on updates to the same note
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(updatedNote);
      }
    } catch (err) {
      showToast("error", "Failed to update note");
      console.error("Error updating note:", err);
      throw err; // Re-throw so NoteEditor can handle it
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
      showToast("success", "Note deleted successfully");
    } catch (err) {
      showToast("error", "Failed to delete note");
      console.error("Error deleting note:", err);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">Notes</h1>
        <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
      </div>

      <div className="app-content">
        <Sidebar
          notes={paginatedNotes}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          loading={loading}
          searchQuery={searchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <NoteEditor note={selectedNote} onUpdateNote={handleUpdateNote} />
      </div>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
