import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  Handle,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';
import CustomPSVNode from './CustomPSVNode'; // Импорт пользовательского SVG узла

// Размер сетки для привязки узлов
const gridSize = 20;

// Функция для привязки узлов к сетке
const snapToGrid = (position) => {
  const snappedX = Math.round(position.x / gridSize) * gridSize;
  const snappedY = Math.round(position.y / gridSize) * gridSize;
  return { x: snappedX, y: snappedY };
};

// Узел по умолчанию
const DefaultNode = () => (
  <div style={{ padding: '10px', backgroundColor: '#ccc', textAlign: 'center', position: 'relative', width: '80px' }}>
    Узел
    <Handle type="source" position="right" style={{ right: '-10px', backgroundColor: 'blue', position: 'absolute' }} />
    <Handle type="target" position="left" style={{ left: '-10px', backgroundColor: 'green', position: 'absolute' }} />
  </div>
);

// Ромбовидный узел
const DiamondNode = () => (
  <div style={{ width: '100px', height: '100px', backgroundColor: 'lightblue', transform: 'rotate(45deg)', position: 'relative' }}>
    <Handle type="source" position="top" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'blue', position: 'absolute' }} />
    <Handle type="target" position="right" style={{ right: '-10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'green', position: 'absolute' }} />
    <Handle type="source" position="bottom" style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'blue', position: 'absolute' }} />
    <Handle type="target" position="left" style={{ left: '-10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'green', position: 'absolute' }} />
  </div>
);

// Входной узел
const InputNode = () => (
  <div style={{ width: '60px', height: '30px', backgroundColor: '#aaffaa', textAlign: 'center', lineHeight: '30px', position: 'relative' }}>
    <Handle type="source" position="right" style={{ right: '-10px', backgroundColor: 'blue', position: 'absolute' }} />
    Выход
  </div>
);

// Выходной узел
const OutputNode = () => (
  <div style={{ width: '60px', height: '30px', backgroundColor: '#ffaaaa', textAlign: 'center', lineHeight: '30px', position: 'relative' }}>
    <Handle type="target" position="left" style={{ left: '-10px', backgroundColor: 'green', position: 'absolute' }} />
    Вход
  </div>
);

// Сеточные линии
const GridLines = ({ showGrid }) => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { width, height } = size;

  const lines = [];
  for (let x = 0; x < width; x += gridSize) {
    lines.push(<line key={`v-${x}`} x1={x} y1="0" x2={x} y2={height} stroke="#ddd" strokeWidth="0.5" />);
  }
  for (let y = 0; y < height; y += gridSize) {
    lines.push(<line key={`h-${y}`} x1="0" y1={y} x2={width} y2={y} stroke="#ddd" strokeWidth="0.5" />);
  }

  return (
    <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      {showGrid && lines}
    </svg>
  );
};

// Определяем типы узлов
const nodeTypes = { customPSVNode: CustomPSVNode, diamond: DiamondNode, input: InputNode, output: OutputNode, default: DefaultNode };

// Начальные узлы и соединения
const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Вход' }, position: { x: 100, y: 100 } },
  { id: '2', type: 'customPSVNode', data: { label: 'PSV Node' }, position: { x: 300, y: 100 } },
  { id: '4', type: 'output', data: { label: 'Выход' }, position: { x: 700, y: 100 } },
];

const initialEdges = [];

const Diagram = ({ reactFlowInstanceRef, showGrid }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      
      const selectedNode = changes.find(change => change.type === 'select' && change.id);
      if (selectedNode) {
        setSelectedNodeId(selectedNode.id);
      }
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Обработчик сброса
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const snappedPosition = snapToGrid(position);

      const newNode = {
        id: `${nodes.length + 1}`,
        type: type,
        position: snappedPosition,
        data: { label: `${type} Node` },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, project]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // Добавление соединений
  const onConnect = (params) => setEdges((eds) => addEdge({
    ...params,
    type: 'step',
    animated: true,
    arrowHeadType: 'arrowclosed',
    style: { stroke: 'red', strokeWidth: 3, zIndex: 10 },
  }, eds));

  // Функция для удаления выделенного узла
  const handleDeleteNode = () => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
      setSelectedNodeId(null); // Сбрасываем выделенный узел
    }
  };

  const onInit = useCallback(
    (instance) => {
      reactFlowInstanceRef.current = instance;
    },
    [reactFlowInstanceRef]
  );

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <GridLines showGrid={showGrid} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes} // Регистрация пользовательских типов узлов
        connectionLineType="step"
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>

      <button onClick={handleDeleteNode} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
        Удалить узел
      </button>
    </div>
  );
};

export default Diagram;
