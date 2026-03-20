import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ onSearch, searchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search notes..."
        value={localQuery}
        onChange={handleChange}
        className="search-input"
      />
      {localQuery && (
        <button
          className="search-clear"
          onClick={() => setLocalQuery('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default React.memo(SearchBar);
