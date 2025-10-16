import React from 'react';
import { motion } from 'framer-motion';
import { getFileIcon, getFileColor } from '../utils/fileIcons';

const TreeNode = ({
  node,
  level = 0,
  isExpanded,
  onToggle,
  searchQuery,
  isSearchResult,
  onNodeHover,
  onNodeLeave
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const IconComponent = getFileIcon(node.name, node.type === 'folder');
  const iconColor = getFileColor(node.name, node.type === 'folder');

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(node.path);
  };

  const handleHover = () => {
    onNodeHover(node.path);
  };

  const handleLeave = () => {
    onNodeLeave(node.path);
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="tree-node-wrapper"
    >
      <motion.div
        className={`tree-node ${isSearchResult ? 'search-result' : ''}`}
        whileHover={{ backgroundColor: 'rgba(96, 165, 250, 0.1)' }}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <div className="node-content">
          {/* Кнопка раскрытия для папок */}
          {node.type === 'folder' && hasChildren && (
            <motion.button
              onClick={handleToggle}
              className="toggle-button"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </motion.button>
          )}

          {/* Пустое пространство для файлов или пустых папок */}
          {node.type === 'folder' && !hasChildren && (
            <div className="toggle-spacer" />
          )}

          {/* Иконка файла/папки */}
          <IconComponent 
            size={14} 
            className="file-icon"
            style={{ color: iconColor }}
          />

          {/* Имя файла/папки */}
          <span className="file-name">
            {node.name}
          </span>

          {/* Размер файла при наведении */}
          {node.type === 'file' && node.size && (
            <span className="file-size">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
      </motion.div>

      {/* Дочерние элементы */}
      {node.type === 'folder' && isExpanded && hasChildren && (
        <div className="children-container">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
              searchQuery={searchQuery}
              isSearchResult={child.isSearchResult}
              onNodeHover={onNodeHover}
              onNodeLeave={onNodeLeave}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TreeNode;
