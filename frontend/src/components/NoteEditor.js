import React, { useState, useEffect, useRef } from "react";
import "./NoteEditor.css";

const NoteEditor = ({ note, onUpdateNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const prevNoteIdRef = useRef(null);

  useEffect(() => {
    if (note) {
      // Only reset if we switched to a different note
      if (prevNoteIdRef.current !== note.id) {
        setTitle(note.title || "");
        setContent(note.content || "");
        setLastSaved(note.updatedAt || note.createdAt);
        setSaveError(null);
        prevNoteIdRef.current = note.id;
      }
    } else {
      setTitle("");
      setContent("");
      setLastSaved(null);
      setSaveError(null);
      prevNoteIdRef.current = null;
    }
  }, [note?.id]);

  const saveTimeoutRef = React.useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSaveError(null);
    scheduleSave();
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setSaveError(null);
    scheduleSave();
  };

  const scheduleSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Increased debounce delay to 2.5 seconds to allow users to type more content
    // before autosave triggers
    saveTimeoutRef.current = setTimeout(() => {
      saveNote();
    }, 2500);
  };

  const saveNote = async () => {
    if (!note) return;

    // Don't autosave if both title and content are empty
    // This prevents the "Untitled Note" issue when clearing everything
    const titleTrimmed = title.trim();
    const contentTrimmed = content.trim();

    if (!titleTrimmed && !contentTrimmed) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      await onUpdateNote(note.id, { title, content });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving note:", error);
      setSaveError("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (title || content) {
      saveNote();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        />
        <div className="editor-status">
          {saveError && <span className="error-indicator">⚠️ {saveError}</span>}
          {!saveError && isSaving && (
            <span className="saving-indicator">💾 Saving...</span>
          )}
          {!saveError && !isSaving && lastSaved && (
            <span className="last-saved">
              ✓ Last saved: {formatDate(lastSaved)}
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
        />
      </div>
    </div>
  );
};

export default React.memo(NoteEditor);
