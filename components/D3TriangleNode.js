import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';
import { Handle } from 'react-flow-renderer';

const D3TriangleNode = () => {
  const ref = useRef(null);
  const [rotation, setRotation] = useState(0);  // Управление углом поворота
  const [showControlPoints, setShowControlPoints] = useState(false); // Показ управляющих точек
  const [isRotating, setIsRotating] = useState(false); // Состояние для поворота
  const [center, setCenter] = useState({ x: 0, y: 0 }); // Центр треугольника

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('width', 100)
      .attr('height', 100);

    const points = [
      { x: 50, y: 0 },   // Верхняя точка
      { x: 0, y: 80 },   // Левая нижняя точка
      { x: 100, y: 80 }, // Правая нижняя точка
    ];

    svg.selectAll('*').remove(); // Убираем старый треугольник перед ререндером

    // Создаем треугольник
    svg.append('polygon')
      .attr('points', points.map(p => [p.x, p.y].join(',')).join(' '))
      .attr('fill', 'red')
      .on('click', (e) => {
        e.stopPropagation(); // Остановка всплытия события
        setShowControlPoints(true); // Показать управляющие точки по клику
        const rect = ref.current.getBoundingClientRect();
        setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      });

    // Добавляем обработчик клика по странице для скрытия управляющих точек
    const handleClickOutside = () => setShowControlPoints(false);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [rotation]);

  // Функция для расчета угла поворота
  const calculateAngle = (e) => {
    const deltaX = e.clientX - center.x;
    const deltaY = e.clientY - center.y;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
  };

  // Функция для обработки начала поворота
  const handleRotationStart = (e) => {
    e.stopPropagation();  // Останавливаем всплытие события
    e.preventDefault();   // Предотвращаем перенос фигуры
    setIsRotating(true);
  };

  // Функция для обработки поворота
  const handleRotationMove = (e) => {
    if (isRotating) {
      const angle = calculateAngle(e);
      setRotation(angle);  // Устанавливаем угол
    }
  };

  // Функция завершения поворота
  const handleRotationEnd = () => {
    setIsRotating(false);
  };

  return (
    <div 
      style={{ position: 'relative', width: '100px', height: '100px', cursor: 'pointer' }}
      onMouseMove={handleRotationMove}
      onMouseUp={handleRotationEnd}
      onMouseLeave={handleRotationEnd}
    >
      {/* SVG с треугольником */}
      <svg
        ref={ref}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isRotating ? 'none' : 'transform 0.3s ease',  // Убираем анимацию во время поворота
        }}
        onClick={(e) => e.stopPropagation()} // Остановка всплытия события при клике на сам SVG
      ></svg>

      {/* Входная точка на верхней вершине треугольника */}
      <Handle type="target" position="top" id="top" style={{
        left: '50%', 
        top: '-10px', 
        transform: 'translateX(-50%)', 
        backgroundColor: 'green', 
        position: 'absolute', 
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`
      }} />

      {/* Входная точка на левой нижней вершине треугольника */}
      <Handle type="target" position="left" id="left" style={{
        left: '-10px', 
        top: `80%`, 
        backgroundColor: 'green', 
        position: 'absolute', 
        transform: `rotate(${rotation}deg)`
      }} />

      {/* Входная точка на правой нижней вершине треугольника */}
      <Handle type="target" position="right" id="right" style={{
        right: '-10px', 
        top: `80%`, 
        backgroundColor: 'green', 
        position: 'absolute', 
        transform: `rotate(${rotation}deg)`
      }} />

      {/* Управляющие точки */}
      {showControlPoints && (
        <div>
          {/* Полукруглая стрелка для поворота (над треугольником) */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '50%',
              width: '30px',
              height: '15px',
              backgroundColor: 'transparent',
              border: '2px solid blue',
              borderTop: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              transform: 'translateX(-50%)',
            }}
            onMouseDown={handleRotationStart}
          >
            {/* Стрелка */}
            <div
              style={{
                position: 'absolute',
                top: '-7px',
                left: '50%',
                width: '0',
                height: '0',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: '5px solid blue',
                transform: 'translateX(-50%) rotate(-45deg)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default D3TriangleNode;
