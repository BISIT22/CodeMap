import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FileNode from './FileNode';
import { saveExpandedFolders, loadExpandedFolders } from '../utils/storageUtils';
import './FileTree.css';

const FileTree = ({ tree, searchQuery }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сохраненных раскрытых папок
  useEffect(() => {
    const saved = loadExpandedFolders();
    setExpandedFolders(saved);
    setIsLoading(false);
  }, []);

  // Сохранение раскрытых папок
  useEffect(() => {
    if (!isLoading) {
      saveExpandedFolders(expandedFolders);
    }
  }, [expandedFolders, isLoading]);

  // Переключение состояния папки
  const handleToggle = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="spinner"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="file-tree"
    >
      <div className="tree-content">
        <FileNode
          node={tree}
          isExpanded={expandedFolders.has(tree.path)}
          onToggle={handleToggle}
          searchQuery={searchQuery}
          isSearchResult={false}
        />
      </div>
    </motion.div>
  );
};

export default FileTree;
