import React, { useState } from 'react';
import './Sidebar.css';
import ConfirmDialog from './ConfirmDialog/ConfirmDialog';
import LoadingSkeleton from './LoadingSkeleton/LoadingSkeleton';

const Sidebar = ({ 
  notes = [], 
  selectedNote, 
  onSelectNote, 
  onCreateNote, 
  onDeleteNote, 
  loading, 
  searchQuery = '',
  currentPage = 1,
  totalPages = 1,
  onPageChange 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, noteId: null });
  
  // Ensure notes is always an array
  const safeNotes = Array.isArray(notes) ? notes : [];

  const handleCreateNewNote = () => {
    setIsCreating(true);
    const newNote = {
      title: '',
      content: ''
    };
    onCreateNote(newNote);
    setTimeout(() => setIsCreating(false), 500);
  };

  const handleDeleteClick = (e, noteId) => {
    e.stopPropagation();
    setDeleteDialog({ isOpen: true, noteId });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.noteId) {
      onDeleteNote(deleteDialog.noteId);
    }
    setDeleteDialog({ isOpen: false, noteId: null });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, noteId: null });
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        
        {startPage > 1 && (
          <>
            <button
              className="pagination-button"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button
              className="pagination-button"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="new-note-button" disabled>
            + New Note
          </button>
        </div>
        <LoadingSkeleton type="sidebar" />
      </div>
    );
  }

  return (
    <div className="sidebar">
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      
      <div className="sidebar-header">
        <button 
          className={`new-note-button ${isCreating ? 'creating' : ''}`}
          onClick={handleCreateNewNote}
        >
          + New Note
        </button>
      </div>
      
      <div className="notes-list">
        {safeNotes.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
          </div>
        ) : (
          <>
            {safeNotes.map(note => (
              <div
                key={note.id}
                className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                onClick={() => onSelectNote(note)}
              >
                <div className="note-header">
                  <h3 className="note-title">
                    {highlightText(note.title || 'Untitled', searchQuery)}
                  </h3>
                  <button
                    className="delete-button"
                    onClick={(e) => handleDeleteClick(e, note.id)}
                    aria-label="Delete note"
                  >
                    ×
                  </button>
                </div>
                
                <p className="note-content">
                  {highlightText(
                    note.content?.substring(0, 100) || 'No content',
                    searchQuery
                  )}
                  {note.content?.length > 100 && '...'}
                </p>
                
                <div className="note-date">
                  {formatDate(note.createdAt)}
                </div>
              </div>
            ))}
            
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
