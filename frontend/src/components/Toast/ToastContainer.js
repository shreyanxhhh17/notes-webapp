import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import Toast from './Toast';
import './ToastContainer.css';

const ToastContainer = () => {
  const { toasts, hideToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.slice(0, 3).map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
