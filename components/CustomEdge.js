import React, { useState, useCallback } from 'react';
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [controlPoints, setControlPoints] = useState([
    { x: (sourceX + targetX) / 2, y: (sourceY + targetY) / 2 }, // Изначальная контрольная точка
  ]);

  const handleDrag = useCallback((event, index) => {
    const newControlPoints = [...controlPoints];
    newControlPoints[index] = {
      x: event.clientX,
      y: event.clientY,
    };
    setControlPoints(newControlPoints);
  }, [controlPoints]);

  const handleDragStart = useCallback((event, index) => {
    event.preventDefault();
    document.addEventListener('mousemove', (e) => handleDrag(e, index));
    document.addEventListener('mouseup', () => handleDragEnd(index));
  }, [handleDrag]);

  const handleDragEnd = useCallback((index) => {
    document.removeEventListener('mousemove', (e) => handleDrag(e, index));
    document.removeEventListener('mouseup', () => handleDragEnd(index));
  }, [handleDrag]);

  // Создаем кастомный путь с контрольными точками
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Линия */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={getMarkerEnd(markerEnd)}
        style={style}
      />

      {/* Контрольные точки */}
      {controlPoints.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={5}
          fill="blue"
          onMouseDown={(e) => handleDragStart(e, index)} // Начало перетаскивания
          style={{ cursor: 'move', zIndex: 10 }}
        />
      ))}
    </>
  );
};

export default CustomEdge;
