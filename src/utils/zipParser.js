import JSZip from 'jszip';

// Список скрытых системных файлов, которые по умолчанию не отображаются
const HIDDEN_SYSTEM_FILES = [
  '.DS_Store',
  'Thumbs.db',
  '.git',
  '.gitignore',
  '.env',
  '.env.local',
  'node_modules',
];

/**
 * Распаковывает ZIP-файл и строит иерархию файлов
 * @param {File} file - ZIP-файл
 * @param {boolean} showHidden - Показывать скрытые файлы
 * @returns {Promise<Object>} Дерево файлов
 */
export const parseZip = async (file, showHidden = false) => {
  try {
    const zip = new JSZip();
    const loaded = await zip.loadAsync(file);

    // Создаем корневой узел дерева
    const tree = {
      name: file.name.replace('.zip', ''),
      type: 'folder',
      children: [],
      path: '',
    };

    // Карта для быстрого поиска папок по пути
    const folderMap = new Map();
    folderMap.set('', tree);

    // Сортируем файлы для правильного порядка
    const files = Object.keys(loaded.files).sort();

    // Обрабатываем каждый файл/папку в архиве
    for (const filePath of files) {
      const zipFile = loaded.files[filePath];

      // Обработка папок
      if (zipFile.dir) {
        const parts = filePath.split('/').filter(Boolean);
        let currentPath = '';

        // Создаем все промежуточные папки
        for (let i = 0; i < parts.length; i++) {
          const folderName = parts[i];
          const parentPath = currentPath;
          currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

          // Если папка еще не создана, создаем ее
          if (!folderMap.has(currentPath)) {
            const folder = {
              name: folderName,
              type: 'folder',
              children: [],
              path: currentPath,
            };

            // Добавляем папку к родителю
            const parent = folderMap.get(parentPath);
            if (parent) {
              parent.children.push(folder);
            }
            folderMap.set(currentPath, folder);
          }
        }
      } 
      // Обработка файлов
      else {
        const parts = filePath.split('/').filter(Boolean);
        const fileName = parts[parts.length - 1];
        const folderPath = parts.slice(0, -1).join('/');

        // Пропускаем скрытые файлы, если не включено отображение
        if (!showHidden && isHiddenFile(fileName)) {
          continue;
        }

        // Создаем узел файла
        const fileNode = {
          name: fileName,
          type: 'file',
          path: filePath,
          size: zipFile._data.uncompressedSize,
        };

        // Добавляем файл к родительской папке
        const parent = folderMap.get(folderPath);
        if (parent) {
          parent.children.push(fileNode);
        }
      }
    }

    // Сортируем дерево
    sortTree(tree);
    return tree;
  } catch (error) {
    console.error('Error parsing ZIP:', error);
    throw new Error('Ошибка при распаковке ZIP-файла');
  }
};

/**
 * Проверяет, является ли файл скрытым системным
 * @param {string} fileName - Имя файла
 * @returns {boolean} True если файл скрытый
 */
const isHiddenFile = (fileName) => {
  return HIDDEN_SYSTEM_FILES.some(
    (hidden) =>
      fileName === hidden ||
      fileName.startsWith(hidden + '/') ||
      fileName.includes('/' + hidden)
  );
};

/**
 * Рекурсивно сортирует дерево: папки перед файлами, по алфавиту
 * @param {Object} node - Узел дерева
 */
const sortTree = (node) => {
  if (node.children) {
    node.children.sort((a, b) => {
      // Папки перед файлами
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      // По алфавиту
      return a.name.localeCompare(b.name);
    });

    // Рекурсивно сортируем детей
    node.children.forEach(sortTree);
  }
};

/**
 * Поиск по дереву файлов
 * @param {Object} tree - Дерево файлов
 * @param {string} query - Поисковый запрос
 * @returns {Object} Отфильтрованное дерево
 */
export const searchTree = (tree, query) => {
  if (!query.trim()) {
    return tree;
  }

  const lowerQuery = query.toLowerCase();

  const filterNode = (node) => {
    const matches = node.name.toLowerCase().includes(lowerQuery);

    if (node.children) {
      const filteredChildren = node.children
        .map(filterNode)
        .filter((child) => child !== null);

      if (matches || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
          isSearchResult: matches,
        };
      }
    } else if (matches) {
      return { ...node, isSearchResult: true };
    }

    return null;
  };

  return filterNode(tree);
};

/**
 * Функция для вычисления позиции узла в дереве
 * @param {Object} node - Узел дерева
 * @param {number} level - Уровень вложенности
 * @returns {Object} Позиция узла {x, y}
 */
export const calculateNodePosition = (node, level = 0) => {
  // Базовая позиция для корня
  if (level === 0) {
    return { x: 400, y: 100 };
  }
  
  // Позиция для ветвей и листьев
  const baseX = 400;
  const baseY = 100;
  const radius = 60 + level * 30;
  const angle = Math.random() * Math.PI * 2;
  
  return {
    x: baseX + Math.cos(angle) * radius,
    y: baseY + Math.sin(angle) * radius
  };
};
