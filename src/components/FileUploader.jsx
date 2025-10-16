import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './FileUploader.css';

const FileUploader = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Обработка событий drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  // Обработка сброса файла
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        onFileSelect(file);
      } else {
        alert('Пожалуйста, загрузите ZIP-файл');
      }
    }
  };

  // Обработка выбора файла через input
  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  // Открытие диалога выбора файла
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`file-uploader ${isDragActive ? 'drag-active' : ''}`}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleChange}
        className="file-input"
        disabled={isLoading}
      />

      <div className="upload-content">
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="upload-icon"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="spinner"
            />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          )}
        </motion.div>

        <div className="upload-text">
          <p className="upload-title">
            {isLoading ? 'Загрузка...' : 'Перетащите ZIP-файл сюда'}
          </p>
          <p className="upload-subtitle">
            или нажмите для выбора файла
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          className="upload-button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Выбрать файл
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FileUploader;
