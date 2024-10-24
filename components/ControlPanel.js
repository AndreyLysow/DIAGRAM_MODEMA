import React from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import Image from 'next/image';

const ControlPanel = ({ reactFlowInstance, showGrid, setShowGrid }) => {
  const saveToJson = () => {
    const flow = reactFlowInstance?.toObject();
    const dataStr = JSON.stringify(flow, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    saveAs(blob, 'diagram.json');
  };

  const saveToSvg = () => {
    const svgElement = document.querySelector('.react-flow__renderer > svg');
    if (svgElement) {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgElement);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      saveAs(blob, 'diagram.svg');
    }
  };

  const saveToPng = () => {
    html2canvas(document.querySelector('.react-flow__renderer')).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, 'diagram.png');
      });
    });
  };

  return (
    <div className="control-panel" style={{ padding: '10px', backgroundColor: '#d3d3d3', width: '200px' }}>
      <h4>Панель управления</h4>

      {/* Элементы для перетаскивания */}
      <div
        draggable
        onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'output')}
        style={{ marginBottom: '10px', padding: '10px', background: '#AFFF00', color: 'black', cursor: 'grab' }}
      >
        Вход
      </div>
      <div
        draggable
        onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'input')}
        style={{ marginBottom: '10px', padding: '10px', background: '#FF5733', color: 'black', cursor: 'grab' }}
      >
        Выход
      </div>
      <div
        draggable
        onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'triangle')}
        style={{ marginBottom: '10px', padding: '10px', background: '#FFC107', color: 'black', cursor: 'grab' }}
      >
        Треугольник
      </div>
      <div
        draggable
        onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'diamond')}
        style={{ marginBottom: '10px', padding: '10px', background: '#ADD8E6', color: 'black', cursor: 'grab' }}
      >
        Ромб
      </div>

      {/* Используем next/image для загрузки изображения */}
      <div
        draggable
        onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'customPSVNode')}
        style={{ marginBottom: '10px', cursor: 'grab' }}
      >
        <Image src="/psv.svg" alt="PSV Icon" width={50} height={50} />
      </div>

      {/* Кнопка для скрытия/показа сетки */}
      <div
        style={{
          marginBottom: '10px',
          padding: '10px',
          background: '#FF69B4',
          color: 'black',
          cursor: 'pointer',
          textAlign: 'center',
        }}
        onClick={() => setShowGrid(!showGrid)}
      >
        {showGrid ? 'Скрыть сетку' : 'Показать сетку'}
      </div>

      {/* Кнопки для сохранения диаграммы */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={saveToJson}
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '10px',
            background: '#FFD700',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Сохранить JSON
        </button>
        <button
          onClick={saveToSvg}
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '10px',
            background: '#ADD8E6',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Сохранить SVG
        </button>
        <button
          onClick={saveToPng}
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '10px',
            background: '#FFB6C1',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Сохранить PNG
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
