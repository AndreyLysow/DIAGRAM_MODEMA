import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import { ReactSVG } from 'react-svg';

const CustomPSVNode = () => {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 }); // Начальные размеры уменьшены в 2 раза

  // Обработка изменения размера
  const handleResize = (svgElement) => {
    if (svgElement) {
      const svgBBox = svgElement.getBBox();
      setDimensions({ width: svgBBox.width, height: svgBBox.height });
    }
  };

  const handleSize = 6; // Размер точек подключения

  return (
    <div style={{ 
      position: 'relative', 
      width: `${dimensions.width}px`, 
      height: `${dimensions.height}px`, 
      cursor: 'pointer',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      {/* SVG */}
      <ReactSVG 
        src="/psv.svg" // Правильный путь к SVG
        beforeInjection={(svg) => {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }} 
        afterInjection={(error, svg) => {
          if (error) {
            console.error('Ошибка загрузки SVG:', error);
          } else {
            handleResize(svg);
          }
        }} 
        style={{ position: 'absolute', top: 0, left: 0 }} 
      />

      {/* Точки подключения */}
      <Handle type="target" position="top" id="top" style={{
        top: 0,
        left: '50%',
        backgroundColor: 'red',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }} />

      <Handle type="target" position="left" id="left" style={{
        top: '50%',
        left: 0,
        backgroundColor: 'blue',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }} />

      <Handle type="source" position="right" id="right" style={{
        top: '50%',
        right: 0,
        backgroundColor: 'red',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(50%, -50%)',
      }} />

      <Handle type="source" position="bottom-left" id="bottom-left" style={{
        bottom: 0,
        left: '15%',
        backgroundColor: 'red',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, 50%)',
      }} />

      <Handle type="source" position="bottom-right" id="bottom-right" style={{
        bottom: 0,
        left: '85%',
        backgroundColor: 'blue',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, 50%)',
      }} />
    </div>
  );
};

export default CustomPSVNode;
