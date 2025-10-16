import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUploader from './components/FileUploader';
import TreeCanvas from './components/TreeCanvas';
import SearchBar from './components/SearchBar';
import HiddenFilesToggle from './components/HiddenFilesToggle';
import { parseZip, searchTree } from './utils/zipParser';
import './App.css';

function App() {
  const [tree, setTree] = useState(null);
  const [filteredTree, setFilteredTree] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHidden, setShowHidden] = useState(false);
  const [fileName, setFileName] = useState('');

  // Установка темной темы по умолчанию
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Обработка выбора файла
  const handleFileSelect = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    setSearchQuery('');

    try {
      const parsedTree = await parseZip(file, showHidden);
      setTree(parsedTree);
      setFilteredTree(parsedTree);
      setFileName(file.name);
    } catch (err) {
      setError(err.message);
      setTree(null);
      setFilteredTree(null);
    } finally {
      setIsLoading(false);
    }
  }, [showHidden]);

  // Обработка изменения поиска
  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query);
      if (tree) {
        const filtered = query.trim() ? searchTree(tree, query) : tree;
        setFilteredTree(filtered);
      }
    },
    [tree]
  );

  // Переключение отображения скрытых файлов
  const handleShowHiddenToggle = useCallback(() => {
    setShowHidden(!showHidden);
    if (tree) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [showHidden, tree]);

  // Сброс состояния
  const handleReset = () => {
    setTree(null);
    setFilteredTree(null);
    setSearchQuery('');
    setError(null);
    setFileName('');
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="app">
      <div className="container">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="header"
        >
          <div className="header-content">
            <div className="title-container">
              <h1 className="title">CodeMap</h1>
              <p className="subtitle">Визуализация структуры ZIP-архивов проектов</p>
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-message"
            >
              <p className="error-title">Ошибка:</p>
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!tree ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="upload-section"
          >
            <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="main-content"
          >
            <div className="controls-panel">
              <div className="file-info">
                <p className="file-label">Загруженный файл:</p>
                <p className="file-name">{fileName}</p>
              </div>
              <div className="controls-right">
                <SearchBar
                  query={searchQuery}
                  onQueryChange={handleSearchChange}
                />
                <HiddenFilesToggle
                  showHidden={showHidden}
                  onToggle={handleShowHiddenToggle}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="reset-button"
                >
                  Загрузить другой файл
                </motion.button>
              </div>
            </div>

            <div className="tree-container">
              {isLoading ? (
                <div className="loading-container">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="spinner"
                  />
                </div>
              ) : filteredTree ? (
                <TreeCanvas
                  tree={filteredTree}
                  searchQuery={searchQuery}
                  showHidden={showHidden}
                  fileName={fileName}
                />
              ) : (
                <div className="no-results">
                  <p>Нет результатов поиска</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
