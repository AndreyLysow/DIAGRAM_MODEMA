import React, { useRef, useState } from 'react';
import Diagram from './Diagram';
import ControlPanel from './ControlPanel';

const App = () => {
  const reactFlowInstance = useRef(null);
  const [showGrid, setShowGrid] = useState(true);  // Состояние для отображения сетки

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Панель управления */}
      <ControlPanel 
        reactFlowInstance={reactFlowInstance.current} 
        showGrid={showGrid} 
        setShowGrid={setShowGrid} 
      />

      {/* Диаграмма */}
      <Diagram 
        reactFlowInstanceRef={reactFlowInstance} 
        showGrid={showGrid} 
      />
    </div>
  );
};

export default App;
