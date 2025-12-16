import React from 'react';
import Circle from './Circle';
import ToggleSwitch from './ToggleSwitch';
import './TreeLevel.css';

const TreeLevel = ({ level, elements }) => {
  return (
    <div className="level" id={`level-${level}`}>
      {elements.map((element, index) => {
        if (element.type === 'circle') {
          return <Circle key={index} color={element.color} />;
        } else if (element.type === 'toggle') {
          return (
            <ToggleSwitch
              key={index}
              size={element.size}
              sizeClass={element.sizeClass}
              bgColor={element.bgColor}
              circleColor={element.circleColor}
              translateX={element.translateX}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default TreeLevel;
