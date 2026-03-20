import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';
import { noteService } from './services/noteService';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notesPerPage = 10;

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getAllNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
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
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const updatedNote = await noteService.updateNote(id, noteData);
      setNotes(prev => prev.map(note => 
        note.id === id ? updatedNote : note
      ));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(updatedNote);
      }
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
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
          error={error}
          searchQuery={searchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        
        <NoteEditor
          note={selectedNote}
          onUpdateNote={handleUpdateNote}
        />
      </div>
    </div>
  );
}

export default App;
