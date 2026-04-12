import React from 'react';

const ARROW_LENGTH = 20;
const ARROW_HEAD = 6;

type TrainMarkerProps = {
  cx: number;
  cy: number;
  angle: number;
  label: string;
};

const TrainMarker: React.FC<TrainMarkerProps> = ({ cx, cy, angle, label }) => {
  const tipX = Math.cos(angle) * ARROW_LENGTH;
  const tipY = Math.sin(angle) * ARROW_LENGTH;
  const perpX = Math.sin(angle) * ARROW_HEAD;
  const perpY = -Math.cos(angle) * ARROW_HEAD;

  return (
    <>
      <circle cx={cx} cy={cy} r={10} fill='#ED1C24' stroke='white' strokeWidth={1.5} />
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
        fontSize={10}
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
