import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = ({ query, onQueryChange, placeholder = 'Поиск файлов и папок...' }) => {
  const handleClear = () => {
    onQueryChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="search-bar"
    >
      <div className="search-container">
        <FiSearch className="search-icon" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="clear-button"
          >
            <FiX size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
