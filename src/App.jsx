import React, { useState, useEffect, useRef } from 'react';
import Star from './components/Star';
import TreeLevel from './components/TreeLevel';
import './App.css';

const COLORS = ["#c0392b", "#f8f9fa", "#d68910", "#0e6655", "#27ae60"];
const TOGGLE_CIRCLE_SIZE = 30;
const ANIMATION_INTERVAL = 1000;

// 트리 구조 정의
const TREE_STRUCTURE = [
  { level: 1, elements: [{ type: 'circle' }] },
  { level: 2, elements: [{ type: 'circle' }, { type: 'circle' }] },
  { level: 3, elements: [{ type: 'toggle', size: 70, sizeClass: 'toggle-switch-s' }, { type: 'circle' }] },
  { level: 4, elements: [{ type: 'circle' }, { type: 'circle' }, { type: 'toggle', size: 70, sizeClass: 'toggle-switch-s' }] },
  { level: 5, elements: [{ type: 'circle' }, { type: 'toggle', size: 110, sizeClass: 'toggle-switch-l' }, { type: 'circle' }] },
  { level: 6, elements: [{ type: 'toggle', size: 70, sizeClass: 'toggle-switch-s' }, { type: 'circle' }, { type: 'toggle', size: 70, sizeClass: 'toggle-switch-s' }, { type: 'circle' }] },
  { level: 7, elements: [{ type: 'circle' }, { type: 'toggle', size: 95, sizeClass: 'toggle-switch-m' }, { type: 'circle' }, { type: 'circle' }, { type: 'circle' }] },
  { level: 8, elements: [{ type: 'circle' }, { type: 'circle' }, { type: 'circle' }, { type: 'circle' }, { type: 'toggle', size: 110, sizeClass: 'toggle-switch-l' }, { type: 'circle' }] },
  { level: 9, elements: [{ type: 'toggle', size: 70, sizeClass: 'toggle-switch-s' }, { type: 'circle' }, { type: 'circle' }, { type: 'circle' }, { type: 'circle' }, { type: 'toggle', size: 95, sizeClass: 'toggle-switch-m' }] },
];

function App() {
  const [counter, setCounter] = useState(0);
  const [treeData, setTreeData] = useState([]);
  const colorMapsRef = useRef({
    circles: new Map(),
    toggleBg: new Map(),
    toggleCircle: new Map(),
  });

  // 랜덤 색상 선택
  const getTwoRandomColors = () => {
    const first = Math.floor(Math.random() * COLORS.length);
    let second = Math.floor(Math.random() * COLORS.length);
    while (second === first) {
      second = Math.floor(Math.random() * COLORS.length);
    }
    return [COLORS[first], COLORS[second]];
  };

  // 고유한 색상 쌍 생성
  const getUniqueColorPairs = () => {
    const pair1 = getTwoRandomColors();
    let pair2 = getTwoRandomColors();
    let attempts = 0;
    const maxAttempts = 100;

    while ((pair2.includes(pair1[0]) || pair2.includes(pair1[1])) && attempts < maxAttempts) {
      pair2 = getTwoRandomColors();
      attempts++;
    }
    return [pair1, pair2];
  };

  // 초기화: 각 요소에 색상 쌍 할당
  useEffect(() => {
    const colorMaps = colorMapsRef.current;
    const initialTreeData = TREE_STRUCTURE.map((levelData) => {
      const elements = levelData.elements.map((element, idx) => {
        const key = `${levelData.level}-${idx}`;
        
        if (element.type === 'circle') {
          const colors = getTwoRandomColors();
          colorMaps.circles.set(key, colors);
          return {
            ...element,
            key,
            color: colors[0],
          };
        } else if (element.type === 'toggle') {
          const [bgColors, circleColors] = getUniqueColorPairs();
          colorMaps.toggleBg.set(key, bgColors);
          colorMaps.toggleCircle.set(key, circleColors);
          return {
            ...element,
            key,
            bgColor: bgColors[0],
            circleColor: circleColors[0],
            translateX: 0,
          };
        }
        return element;
      });

      return {
        ...levelData,
        elements,
      };
    });

    setTreeData(initialTreeData);
  }, []);

  // 애니메이션 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, ANIMATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // counter 변경에 따른 애니메이션
  useEffect(() => {
    if (treeData.length === 0) return;

    const colorMaps = colorMapsRef.current;
    const updatedTreeData = treeData.map((levelData) => {
      const elements = levelData.elements.map((element) => {
        if (element.type === 'circle') {
          const colors = colorMaps.circles.get(element.key);
          if (colors) {
            const colorIdx = counter % 2;
            return { ...element, color: colors[colorIdx] };
          }
        } else if (element.type === 'toggle') {
          const bgColors = colorMaps.toggleBg.get(element.key);
          const circleColors = colorMaps.toggleCircle.get(element.key);
          
          if (bgColors && circleColors) {
            const isLarge = element.sizeClass === 'toggle-switch-l';
            const shouldToggle = isLarge ? counter % 2 === 0 : counter % 2 !== 0;
            
            const translateX = shouldToggle ? element.size - TOGGLE_CIRCLE_SIZE : 0;
            const bgColorIdx = shouldToggle ? 1 : 0;
            const circleColorIdx = counter % 2;
            
            return {
              ...element,
              bgColor: bgColors[bgColorIdx],
              circleColor: circleColors[circleColorIdx],
              translateX,
            };
          }
        }
        return element;
      });

      return { ...levelData, elements };
    });

    setTreeData(updatedTreeData);
  }, [counter]);

  // 페이지가 보이지 않을 때 애니메이션 일시 중지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCounter((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div id="container">
      <Star />
      {treeData.map((levelData) => (
        <TreeLevel
          key={levelData.level}
          level={levelData.level}
          elements={levelData.elements}
        />
      ))}
    </div>
  );
}

export default App;
