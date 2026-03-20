import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

const NoteEditor = ({ note, onUpdateNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setLastSaved(note.updatedAt || note.createdAt);
    } else {
      setTitle('');
      setContent('');
      setLastSaved(null);
    }
  }, [note]);

  const saveTimeoutRef = React.useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    scheduleSave();
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    scheduleSave();
  };

  const scheduleSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote();
    }, 1000);
  };

  const saveNote = async () => {
    if (!note) return;

    try {
      setIsSaving(true);
      await onUpdateNote(note.id, { title, content });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveNote();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!note) {
    return (
      <div className="note-editor">
        <div className="empty-editor">
          <div className="empty-icon">📝</div>
          <h2>Select a note to start editing</h2>
          <p>Choose a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          placeholder="Note title..."
          className="title-input"
          disabled={isSaving}
        />
        <div className="editor-status">
          {isSaving && <span className="saving-indicator">Saving...</span>}
          {!isSaving && lastSaved && (
            <span className="last-saved">
              Last saved: {formatDate(lastSaved)}
            </span>
          )}
        </div>
      </div>
      
      <div className="editor-content">
        <textarea
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          placeholder="Start writing your note..."
          className="content-textarea"
          disabled={isSaving}
        />
      </div>
    </div>
  );
};

export default React.memo(NoteEditor);
