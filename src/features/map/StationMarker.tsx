import React from 'react';

type StationMarkerProps = {
  cx: number;
  cy: number;
  lineColor: string;
  isTransfer: boolean;
  isHovered: boolean;
  hoverColor: string;
};

const StationMarker: React.FC<StationMarkerProps> = ({
  cx,
  cy,
  lineColor,
  isTransfer,
  isHovered,
  hoverColor,
}) => {
  if (isTransfer) {
    return (
      <>
        <circle
          cx={cx}
          cy={cy}
          r={isHovered ? 13 : 10}
          fill='white'
          stroke={isHovered ? hoverColor : lineColor}
          strokeWidth={isHovered ? 3 : 2}
        />
        <circle cx={cx} cy={cy} r={isHovered ? 11 : 8} fill={lineColor} />
      </>
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isHovered ? 8 : 6}
      fill='white'
      stroke={isHovered ? hoverColor : lineColor}
      strokeWidth={isHovered ? 3 : 2}
    />
  );
};

export { StationMarker };
