import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'noteCard', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'noteCard':
        return (
          <div className="skeleton-note-card">
            <div className="skeleton-title"></div>
            <div className="skeleton-content"></div>
            <div className="skeleton-content short"></div>
            <div className="skeleton-date"></div>
          </div>
        );
      case 'editor':
        return (
          <div className="skeleton-editor">
            <div className="skeleton-editor-title"></div>
            <div className="skeleton-editor-content"></div>
          </div>
        );
      case 'sidebar':
        return (
          <div className="skeleton-sidebar">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-note-card">
                <div className="skeleton-title"></div>
                <div className="skeleton-content"></div>
                <div className="skeleton-date"></div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="loading-skeleton" aria-busy="true" aria-label="Loading">
      {[...Array(count)].map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
