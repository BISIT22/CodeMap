import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFolder, FiFile, FiZoomIn, FiZoomOut, FiMaximize } from 'react-icons/fi';
import { getFileIcon, getFileColor } from '../utils/fileIcons';
import { exportSVG, exportPNG } from '../utils/exportUtils';
import './TreeCanvas.css';

const TreeCanvas = ({ tree, searchQuery, showHidden, fileName }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Обновление размеров при изменении окна
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Функция экспорта в SVG
  const handleExportSVG = () => {
    if (svgRef.current) {
      const svgContent = new XMLSerializer().serializeToString(svgRef.current);
      exportSVG(svgContent, fileName || 'tree');
    }
  };

  // Функция экспорта в PNG
  const handleExportPNG = () => {
    if (svgRef.current) {
      const svgContent = new XMLSerializer().serializeToString(svgRef.current);
      exportPNG(svgContent, fileName || 'tree');
    }
  };

  // Увеличение масштаба
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  // Уменьшение масштаба
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  // Сброс масштаба и панорамирования
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Обработка начала перетаскивания
  const handleDragStart = (nodeId, x, y, event) => {
    event.stopPropagation();
    setDraggingNode(nodeId);
    setDragOffset({
      x: event.clientX - x,
      y: event.clientY - y
    });
    event.preventDefault();
  };

  // Обработка перетаскивания
  const handleDrag = (event) => {
    if (draggingNode) {
      const newX = event.clientX - dragOffset.x;
      const newY = event.clientY - dragOffset.y;
      
      setNodePositions(prev => ({
        ...prev,
        [draggingNode]: { x: newX, y: newY }
      }));
      event.preventDefault();
    }
  };

  // Обработка окончания перетаскивания
  const handleDragEnd = () => {
    setDraggingNode(null);
  };

  // Обработка начала панорамирования
  const handlePanStart = (event) => {
    // Не начинаем панорамирование, если перетаскиваем узел
    if (draggingNode) return;
    
    // Не начинаем панорамирование, если клик по интерактивному элементу
    if (event.target.classList.contains('node-hitbox') || 
        event.target.classList.contains('leaf-hitbox') ||
        event.target.closest('.node-hitbox') ||
        event.target.closest('.leaf-hitbox')) {
      return;
    }
    
    setIsPanning(true);
    setPanStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    event.preventDefault();
  };

  // Обработка панорамирования
  const handlePan = (event) => {
    if (isPanning && !draggingNode) {
      setPan({
        x: event.clientX - panStart.x,
        y: event.clientY - panStart.y
      });
      event.preventDefault();
    }
  };

  // Обработка окончания панорамирования
  const handlePanEnd = () => {
    setIsPanning(false);
  };

  // Обработка колеса мыши для масштабирования
  const handleWheel = (event) => {
    if (event.ctrlKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.3, Math.min(prev * delta, 3)));
    }
  };

  // Добавляем обработчики событий мыши для перетаскивания и панорамирования
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handlePanStart);
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      // Всегда добавляем обработчики перетаскивания и окончания
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mousemove', handlePan);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('mouseup', handlePanEnd);
      document.addEventListener('mouseleave', handlePanEnd);
      
      return () => {
        container.removeEventListener('mousedown', handlePanStart);
        container.removeEventListener('wheel', handleWheel);
        
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mousemove', handlePan);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('mouseup', handlePanEnd);
        document.removeEventListener('mouseleave', handlePanEnd);
      };
    }
  }, [draggingNode, dragOffset, isPanning, panStart, pan]);

  // Рекурсивная функция для рисования дерева с улучшенной разверткой
  const drawTree = (node, x, y, level = 0, parentX = null, parentY = null, index = 0, siblingsCount = 1) => {
    if (!node) return [];

    // Получаем позицию узла, если он перемещен
    const nodeId = node.path || 'root';
    const draggedPosition = nodePositions[nodeId];
    const currentX = draggedPosition ? draggedPosition.x : x;
    const currentY = draggedPosition ? draggedPosition.y : y;
    
    const elements = [];
    const isHovered = hoveredNode === nodeId;
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.children && node.children.length > 0;
    
    // Цвета для разных типов файлов
    const iconColor = getFileColor(node.name, node.type === 'folder');
    
    // Рисуем линию к родителю, если он есть
    if (parentX !== null && parentY !== null) {
      // Создаем кривую линию вместо прямой
      const midX = (parentX + currentX) / 2;
      const midY = parentY;
      
      elements.push(
        <path
          key={`line-${nodeId}`}
          d={`M ${parentX} ${parentY} C ${midX} ${parentY}, ${midX} ${currentY}, ${currentX} ${currentY}`}
          fill="none"
          stroke={isHovered ? '#60a5fa' : '#475569'}
          strokeWidth="2"
          className="tree-branch"
        />
      );
    }

    // Рисуем узел
    if (node.type === 'folder') {
      // Папка - ветвь дерева
      elements.push(
        <g key={`node-${nodeId}`}>
          {/* Расширенный хитбокс для всей области узла */}
          <circle
            cx={currentX}
            cy={currentY}
            r="30"
            fill="transparent"
            className="node-hitbox"
            onMouseEnter={() => setHoveredNode(nodeId)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => {
              if (hasChildren) {
                const newExpanded = new Set(expandedNodes);
                if (newExpanded.has(nodeId)) {
                  newExpanded.delete(nodeId);
                } else {
                  newExpanded.add(nodeId);
                }
                setExpandedNodes(newExpanded);
              }
            }}
            onMouseDown={(e) => handleDragStart(nodeId, currentX, currentY, e)}
          />
          <circle
            cx={currentX}
            cy={currentY}
            r={isHovered ? 16 : 14}
            fill={isHovered ? '#60a5fa' : '#334155'}
            className="tree-node"
          />
          <foreignObject x={currentX - 12} y={currentY - 12} width="24" height="24" className="node-icon">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <FiFolder size={16} color="white" />
            </div>
          </foreignObject>
          
          {/* Название папки */}
          <text
            x={currentX}
            y={currentY + 30}
            textAnchor="middle"
            fill={isHovered ? '#e2e8f0' : '#94a3b8'}
            fontSize="12"
            className="node-label"
          >
            {node.name}
          </text>
          
          {hasChildren && (
            <text
              x={currentX}
              y={currentY + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              className="node-toggle"
            >
              {isExpanded ? '−' : '+'}
            </text>
          )}
        </g>
      );
      
      // Рисуем детей, если папка раскрыта
      if (isExpanded && hasChildren) {
        const verticalSpacing = 120;
        const horizontalSpacing = Math.max(100, 200 - level * 20);
        
        node.children.forEach((child, childIndex) => {
          const childX = currentX + (childIndex - (node.children.length - 1) / 2) * horizontalSpacing;
          const childY = currentY + verticalSpacing;
          
          elements.push(...drawTree(child, childX, childY, level + 1, currentX, currentY, childIndex, node.children.length));
        });
      }
    } else {
      // Файл - лист дерева
      elements.push(
        <g key={`leaf-${nodeId}`}>
          {/* Расширенный хитбокс для файла */}
          <circle
            cx={currentX}
            cy={currentY}
            r="20"
            fill="transparent"
            className="leaf-hitbox"
            onMouseEnter={() => setHoveredNode(nodeId)}
            onMouseLeave={() => setHoveredNode(null)}
            onMouseDown={(e) => handleDragStart(nodeId, currentX, currentY, e)}
          />
          <motion.circle
            cx={currentX}
            cy={currentY}
            r={isHovered ? 12 : 10}
            fill={iconColor}
            className="tree-leaf"
            animate={{
              scale: isHovered ? 1.3 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <foreignObject x={currentX - 8} y={currentY - 8} width="16" height="16" className="leaf-icon">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <FiFile size={12} color="white" />
            </div>
          </foreignObject>
          
          {/* Название файла */}
          <text
            x={currentX}
            y={currentY + 25}
            textAnchor="middle"
            fill={isHovered ? '#e2e8f0' : '#94a3b8'}
            fontSize="11"
            className="leaf-label"
          >
            {node.name}
          </text>
        </g>
      );
    }

    // Подсветка при поиске
    if (searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      elements.push(
        <circle
          key={`highlight-${nodeId}`}
          cx={currentX}
          cy={currentY}
          r="20"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeDasharray="4,4"
          className="search-highlight"
        />
      );
    }

    return elements;
  };

  // Рисуем дерево
  const treeElements = tree ? drawTree(tree, dimensions.width / 2, 80) : [];

  return (
    <div className="tree-canvas-container" ref={containerRef}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${dimensions.width / zoom} ${dimensions.height / zoom}`}
        className="tree-svg"
        style={{ cursor: isPanning ? 'grabbing' : (draggingNode ? 'grabbing' : 'grab') }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feFlood floodColor="#60a5fa" floodOpacity="0.5" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`translate(${pan.x / zoom},${pan.y / zoom}) scale(${zoom})`}>
          {treeElements}
        </g>
      </svg>
      
      {tree && (
        <div className="tree-controls">
          <button className="export-button" onClick={handleExportSVG}>
            <FiDownload size={16} />
            <span>SVG</span>
          </button>
          <button className="export-button" onClick={handleExportPNG}>
            <FiDownload size={16} />
            <span>PNG</span>
          </button>
          <button className="zoom-button" onClick={handleZoomIn}>
            <FiZoomIn size={16} />
          </button>
          <button className="zoom-button" onClick={handleZoomOut}>
            <FiZoomOut size={16} />
          </button>
          <button className="zoom-button" onClick={handleResetView}>
            <FiMaximize size={16} />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        </div>
      )}
      
      {tree && (
        <div className="tree-info">
          <p>Количество узлов: {countNodes(tree)}</p>
        </div>
      )}
    </div>
  );
};

// Функция подсчета узлов
const countNodes = (node) => {
  if (!node) return 0;
  let count = 1;
  if (node.children) {
    node.children.forEach(child => {
      count += countNodes(child);
    });
  }
  return count;
};

export default TreeCanvas;
