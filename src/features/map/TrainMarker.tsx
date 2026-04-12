import React from 'react';

const ARROW_LENGTH = 20;
const ARROW_HEAD = 6;

type TrainMarkerProps = {
  cx: number;
  cy: number;
  angle: number;
  label: string;
  isHovered: boolean;
};

const TrainMarker: React.FC<TrainMarkerProps> = ({ cx, cy, angle, label, isHovered }) => {
  const tipX = Math.cos(angle) * ARROW_LENGTH;
  const tipY = Math.sin(angle) * ARROW_LENGTH;
  const perpX = Math.sin(angle) * ARROW_HEAD;
  const perpY = -Math.cos(angle) * ARROW_HEAD;
  const shadowFilter = isHovered ? 'url(#train-shadow-hover)' : 'url(#train-shadow)';

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={isHovered ? 12 : 10}
        fill='#ED1C24'
        stroke='white'
        strokeWidth={isHovered ? 3 : 1.5}
        filter={shadowFilter}
      />
      <polygon
        points={`
          ${cx + tipX},${cy + tipY}
          ${cx + tipX * 0.6 + perpX},${cy + tipY * 0.6 + perpY}
          ${cx + tipX * 0.6 - perpX},${cy + tipY * 0.6 - perpY}
        `}
        fill='white'
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx + tipX * 0.6}
        y2={cy + tipY * 0.6}
        stroke='white'
        strokeWidth={2}
      />
      <text
        x={cx + 8}
        y={cy - 12}
        fontSize={isHovered ? 12 : 10}
        fontWeight='bold'
        fill='white'
        filter='url(#text-shadow)'
      >
        {label}
      </text>
    </>
  );
};

export { TrainMarker };
