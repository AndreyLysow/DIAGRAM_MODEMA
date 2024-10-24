import { addEdge, applyEdgeChanges } from 'react-flow-renderer';
import { useState, useCallback } from 'react';
import CustomEdge from './CustomEdge'; // Импорт кастомного соединения

export const initialEdges = [];

// Хук для управления соединениями
export const useEdges = () => {
  const [edges, setEdges] = useState(initialEdges);

  // Обработчик изменения соединений
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Добавление новых соединений
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom', // Используем кастомный тип соединения
            animated: true,
            arrowHeadType: 'arrowclosed',
            style: { stroke: 'red', strokeWidth: 3, zIndex: 10 },
          },
          eds
        )
      ),
    []
  );

  // Возвращаем кастомный тип соединения
  return { edges, onEdgesChange, onConnect, edgeTypes: { custom: CustomEdge } };
};
