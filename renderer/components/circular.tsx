import React from 'react';

const CustomCircularProgress = ({ size = 100, thickness = 10, color = '#3f51b5', progress = 0 }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg className="progress-ring" width={size} height={size}>
      <circle
        className="progress-ring-circle"
        stroke="#ddd"
        strokeWidth={thickness}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="progress-ring-circle"
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};

export default CustomCircularProgress;
