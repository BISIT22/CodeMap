// Функции для экспорта дерева в SVG/PNG

/**
 * Экспорт SVG в файл
 * @param {string} svgContent - Содержимое SVG
 * @param {string} filename - Имя файла
 */
export const exportSVG = (svgContent, filename) => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Экспорт SVG в PNG
 * @param {string} svgContent - Содержимое SVG
 * @param {string} filename - Имя файла
 */
export const exportPNG = (svgContent, filename) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Установка размеров canvas
  canvas.width = 1200;
  canvas.height = 800;
  
  // Создание изображения из SVG
  const img = new Image();
  img.onload = () => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    // Экспорт в PNG
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Преобразование SVG в data URL
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  img.src = URL.createObjectURL(svgBlob);
};
