import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import { ReactSVG } from 'react-svg';

const CustomPSVNode = () => {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  const handleResize = (svgElement) => {
    const svgBBox = svgElement.getBBox();
    setDimensions({ width: svgBBox.width, height: svgBBox.height });
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
        src="/psv.svg"
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

      {/* Верхняя точка */}
      <Handle type="source" position="top" id="top-source" style={{
        top: 0,
        left: '50%',
        backgroundColor: 'red',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }} />
      <Handle type="target" position="top" id="top-target" style={{
        top: 0,
        left: '50%',
        backgroundColor: 'red',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }} />

      {/* Левая боковая точка */}
      <Handle type="source" position="left" id="left-source" style={{
        top: '50%',
        left: 0,
        backgroundColor: 'blue',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }} />
      <Handle type="target" position="left" id="left-target" style={{
        top: '50%',
        left: 0,
        backgroundColor: 'blue',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }} />

      {/* Правая боковая точка */}
      <Handle type="source" position="right" id="right-source" style={{
        top: '50%',
        right: 0,
        backgroundColor: 'blue',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(50%, -50%)',
      }} />
      <Handle type="target" position="right" id="right-target" style={{
        top: '50%',
        right: 0,
        backgroundColor: 'blue',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(50%, -50%)',
      }} />

      {/* Нижняя точка слева */}
      <Handle type="source" position="bottom" id="bottom-left-source" style={{
        bottom: 0,
        left: '25%',  // Смещение для левой точки
        backgroundColor: 'red',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, 50%)',
      }} />
      <Handle type="target" position="bottom" id="bottom-left-target" style={{
        bottom: 0,
        left: '25%',  // Смещение для левой точки
        backgroundColor: 'red',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, 50%)',
      }} />

      {/* Нижняя точка справа */}
      <Handle type="source" position="bottom" id="bottom-right-source" style={{
        bottom: 0,
        left: '75%',  // Смещение для правой точки
        backgroundColor: 'blue',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, 50%)',
      }} />
      <Handle type="target" position="bottom" id="bottom-right-target" style={{
        bottom: 0,
        left: '75%',  // Смещение для правой точки
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
