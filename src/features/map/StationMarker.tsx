import React from 'react';

type StationMarkerProps = {
  cx: number;
  cy: number;
  lineColor: string;
  isTransfer: boolean;
};

const StationMarker: React.FC<StationMarkerProps> = ({ cx, cy, lineColor, isTransfer }) => {
  if (isTransfer) {
    return (
      <>
        <circle cx={cx} cy={cy} r={10} fill='white' stroke={lineColor} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={8} fill={lineColor} />
      </>
    );
  }

  return <circle cx={cx} cy={cy} r={6} fill='white' stroke={lineColor} strokeWidth={2} />;
};

export { StationMarker };
