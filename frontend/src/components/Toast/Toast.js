import React from 'react';
import './Toast.css';

const Toast = ({ id, type, message, onClose }) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live={type === 'error' || type === 'warning' ? 'assertive' : 'polite'}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => onClose(id)} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default Toast;
