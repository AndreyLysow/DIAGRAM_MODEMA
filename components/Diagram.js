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
import { v4 as uuidv4 } from 'uuid'; // Для генерации уникальных идентификаторов
import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';
import CustomPSVNode from './CustomPSVNode';

// Размер сетки
const gridSize = 20;

// Привязка узлов к сетке
const snapToGrid = (position) => {
  const snappedX = Math.round(position.x / gridSize) * gridSize;
  const snappedY = Math.round(position.y / gridSize) * gridSize;
  return { x: snappedX, y: snappedY };
};

// Компонент DefaultNode
const DefaultNode = () => (
  <div style={{ padding: '10px', backgroundColor: '#ccc', textAlign: 'center', position: 'relative', width: '80px' }}>
    Узел
    <Handle type="source" position="right" style={{ right: '-10px', backgroundColor: 'blue' }} />
    <Handle type="target" position="left" style={{ left: '-10px', backgroundColor: 'green' }} />
  </div>
);

// Входной узел
const InputNode = () => (
  <div style={{ width: '60px', height: '30px', backgroundColor: '#aaffaa', textAlign: 'center', lineHeight: '30px' }}>
    <Handle type="source" position="right" style={{ right: '-10px', backgroundColor: 'blue' }} />
    Вход
  </div>
);

// Выходной узел
const OutputNode = () => (
  <div style={{ width: '60px', height: '30px', backgroundColor: '#ffaaaa', textAlign: 'center', lineHeight: '30px' }}>
    <Handle type="target" position="left" style={{ left: '-10px', backgroundColor: 'green' }} />
    Выход
  </div>
);

// Компонент для отрисовки сетки
const GridLines = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const lines = [];
  for (let x = 0; x < size.width; x += gridSize) {
    lines.push(<line key={`v-${x}`} x1={x} y1="0" x2={x} y2={size.height} stroke="#ddd" strokeWidth="0.5" />);
  }
  for (let y = 0; y < size.height; y += gridSize) {
    lines.push(<line key={`h-${y}`} x1="0" y1={y} x2={size.width} y2={y} stroke="#ddd" strokeWidth="0.5" />);
  }

  return (
    <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      {lines}
    </svg>
  );
};

// Определяем типы узлов
const nodeTypes = { customPSVNode: CustomPSVNode, input: InputNode, output: OutputNode, default: DefaultNode };

// Начальные узлы и соединения
const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Вход' }, position: { x: 100, y: 100 } },
  { id: '2', type: 'customPSVNode', data: { label: 'PSV Node' }, position: { x: 300, y: 100 } },
  { id: '4', type: 'output', data: { label: 'Выход' }, position: { x: 700, y: 100 } },
];

const initialEdges = [];

const Diagram = ({ reactFlowInstanceRef }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);

      const selectedNode = changes.find((change) => change.type === 'select' && change.id);
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
        id: uuidv4(), // Используем уникальный идентификатор
        type,
        position: snappedPosition,
        data: { label: `${type} Node` },
      };

      setNodes((prevNodes) => [...prevNodes, newNode]); // Обновляем массив узлов корректно
    },
    [nodes, project]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onConnect = (params) => setEdges((eds) => addEdge({
    ...params,
    type: 'step',
    animated: true,
    arrowHeadType: 'arrowclosed',
    style: { stroke: 'red', strokeWidth: 3, zIndex: 10 },
  }, eds));

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
      setSelectedNodeId(null);
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
      <GridLines />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes}
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
