import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiFolder, FiFile, FiCode, FiImage, FiMusic, FiVideo, FiArchive, FiFileText, FiSettings, FiDatabase } from 'react-icons/fi';
import './FileNode.css';

// Карта иконок для разных типов файлов
const getIcon = (fileName, isFolder) => {
  if (isFolder) return FiFolder;
  
  const ext = fileName.split('.').pop().toLowerCase();
  
  // Карта расширений файлов
  const iconMap = {
    // Код
    js: FiCode,
    jsx: FiCode,
    ts: FiCode,
    tsx: FiCode,
    py: FiCode,
    java: FiCode,
    cpp: FiCode,
    cs: FiCode,
    html: FiCode,
    css: FiCode,
    scss: FiCode,
    
    // Изображения
    png: FiImage,
    jpg: FiImage,
    jpeg: FiImage,
    gif: FiImage,
    svg: FiImage,
    webp: FiImage,
    ico: FiImage,
    
    // Медиа
    mp3: FiMusic,
    wav: FiMusic,
    flac: FiMusic,
    mp4: FiVideo,
    avi: FiVideo,
    mov: FiVideo,
    mkv: FiVideo,
    
    // Архивы
    zip: FiArchive,
    rar: FiArchive,
    '7z': FiArchive,
    tar: FiArchive,
    gz: FiArchive,
    
    // Документы
    pdf: FiFileText,
    doc: FiFileText,
    docx: FiFileText,
    txt: FiFileText,
    md: FiFileText,
    
    // Конфигурации
    json: FiSettings,
    yaml: FiSettings,
    yml: FiSettings,
    xml: FiSettings,
    env: FiSettings,
    
    // Базы данных
    sql: FiDatabase,
    db: FiDatabase,
    sqlite: FiDatabase,
  };
  
  return iconMap[ext] || FiFile;
};

// Карта цветов для разных типов файлов
const getIconColor = (fileName, isFolder) => {
  if (isFolder) return '#60a5fa'; // Голубой для папок
  
  const ext = fileName.split('.').pop().toLowerCase();
  
  const colorMap = {
    // JavaScript/TypeScript
    js: '#fbbf24',
    jsx: '#fbbf24',
    ts: '#60a5fa',
    tsx: '#60a5fa',
    
    // Python
    py: '#60a5fa',
    
    // HTML/CSS
    html: '#f97316',
    css: '#60a5fa',
    scss: '#ec4899',
    
    // JSON
    json: '#fbbf24',
    
    // Изображения
    png: '#a78bfa',
    jpg: '#a78bfa',
    svg: '#f97316',
    
    // Архивы
    zip: '#f87171',
    rar: '#f87171',
    
    // Документы
    pdf: '#f87171',
    md: '#94a3b8',
  };
  
  return colorMap[ext] || '#94a3b8';
};

const FileNode = ({
  node,
  level = 0,
  isExpanded,
  onToggle,
  searchQuery,
  isSearchResult,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getIcon(node.name, node.type === 'folder');
  const iconColor = getIconColor(node.name, node.type === 'folder');
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(node.path);
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // Определяем, является ли узел последним в списке
  const isLast = node.isLast;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="file-node-wrapper"
    >
      <motion.div
        className={`file-node ${isSearchResult ? 'search-result' : ''}`}
        whileHover={{ backgroundColor: 'rgba(96, 165, 250, 0.1)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Линии соединения для визуализации дерева */}
        <div className="tree-lines" style={{ paddingLeft: `${level * 1.25}rem` }}>
          {Array.from({ length: level }).map((_, index) => (
            <div key={index} className="vertical-line" />
          ))}
          {level > 0 && <div className="horizontal-line" />}
        </div>
        
        <div className="node-content">
          {/* Кнопка раскрытия для папок */}
          {node.type === 'folder' && hasChildren && (
            <motion.button
              onClick={handleToggle}
              className="toggle-button"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronRight size={14} />
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
          {node.type === 'file' && node.size && isHovered && (
            <span className="file-size">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
      </motion.div>

      {/* Дочерние элементы */}
      <AnimatePresence>
        {node.type === 'folder' && isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="children-container"
          >
            {node.children.map((child, index) => (
              <FileNode
                key={child.path}
                node={{
                  ...child,
                  isLast: index === node.children.length - 1
                }}
                level={level + 1}
                isExpanded={isExpanded}
                onToggle={onToggle}
                searchQuery={searchQuery}
                isSearchResult={child.isSearchResult}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileNode;
