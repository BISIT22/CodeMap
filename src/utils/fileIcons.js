import {
  FiFolder,
  FiFile,
  FiCode,
  FiImage,
  FiMusic,
  FiVideo,
  FiArchive,
  FiFileText,
  FiSettings,
  FiDatabase
} from 'react-icons/fi';

// Карта иконок для разных типов файлов
export const getFileIcon = (fileName, isFolder) => {
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
export const getFileColor = (fileName, isFolder) => {
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
    
    // По умолчанию
    default: '#94a3b8'
  };
  
  return colorMap[ext] || colorMap.default;
};
