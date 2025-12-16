import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ size, sizeClass, bgColor, circleColor, translateX }) => {
  return (
    <div 
      className={`toggle-switch ${sizeClass}`}
      style={{ 
        width: `${size}px`,
        backgroundColor: bgColor 
      }}
    >
      <div 
        className="toggle-circle"
        style={{ 
          backgroundColor: circleColor,
          transform: `translateX(${translateX}px)`
        }}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
