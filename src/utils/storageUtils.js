// Ключи для localStorage
const EXPANDED_FOLDERS_KEY = 'expandedFolders';
const THEME_KEY = 'theme';

/**
 * Сохраняет список раскрытых папок
 * @param {Set} expandedPaths - Набор путей раскрытых папок
 */
export const saveExpandedFolders = (expandedPaths) => {
  try {
    localStorage.setItem(EXPANDED_FOLDERS_KEY, JSON.stringify(Array.from(expandedPaths)));
  } catch (error) {
    console.error('Error saving expanded folders:', error);
  }
};

/**
 * Загружает список раскрытых папок
 * @returns {Set} Набор путей раскрытых папок
 */
export const loadExpandedFolders = () => {
  try {
    const stored = localStorage.getItem(EXPANDED_FOLDERS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (error) {
    console.error('Error loading expanded folders:', error);
    return new Set();
  }
};

/**
 * Очищает сохраненные раскрытые папки
 */
export const clearExpandedFolders = () => {
  try {
    localStorage.removeItem(EXPANDED_FOLDERS_KEY);
  } catch (error) {
    console.error('Error clearing expanded folders:', error);
  }
};

/**
 * Сохраняет выбранную тему
 * @param {string} theme - Тема ('light' или 'dark')
 */
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

/**
 * Загружает сохраненную тему
 * @returns {string} Тема ('light' или 'dark')
 */
export const loadTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (error) {
    console.error('Error loading theme:', error);
    return 'light';
  }
};
