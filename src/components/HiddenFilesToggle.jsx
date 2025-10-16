import React from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './HiddenFilesToggle.css';

const HiddenFilesToggle = ({ showHidden, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden-files-toggle"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`toggle-button ${showHidden ? 'active' : ''}`}
      >
        {showHidden ? <FiEye size={18} /> : <FiEyeOff size={18} />}
        <span className="toggle-label">Скрытые файлы</span>
      </motion.button>
    </motion.div>
  );
};

export default HiddenFilesToggle;
