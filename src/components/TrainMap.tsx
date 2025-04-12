import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Stage, Layer, Circle, Text, Line as KonvaLine, Group } from 'react-konva';

import { stationMappings } from '../utils/stationMappings';
import { stationCoordinates, lines } from '../utils/staticData';


// Helper function to get lines for a specific station
const getStationLines = (stationId: string): string[] => {
  const station = stationMappings[stationId];
  if (!station) return [];
  return Array.isArray(station.lines) ? station.lines : [station.lines];
};

// Helper to check if a station is a transfer station (has multiple lines)
const isTransferStation = (stationId: string): boolean => {
  const lines = getStationLines(stationId);
  return lines.length > 1;
};



const TrainMap: React.FC<any> = () => {
  const [dimensions, _] = useState({ width: 1000, height: 800 });
  const navigate = useNavigate(); // Initialize navigate

  // Generate line path points for a specific line
  const generateLinePath = (stationIds: string[]) => {
    if (stationIds.length < 2) return [];
    
    // Sort stations by their order in the array (assumes they're in correct order)
    const points: number[] = [];
    
    stationIds.forEach(stationId => {
      const coords = stationCoordinates[stationId];
      if (coords) {
        points.push(coords.x);
        points.push(coords.y);
      }
    });
    
    return points;
  };

  // Get color for the line
  const getLineColor = (lineName: string) => {
    return lines[lineName].color || "#888888"; // Default to gray if color not found
  };

  return (
    <div className="train-map">    
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {Object.values(lines).map((lineData, idx) => (
            <KonvaLine
              key={`line-${idx}`}
              points={generateLinePath(lineData.stations)}
              stroke={lineData.color}
              strokeWidth={10}
              tension={0}
              lineCap="round"
              lineJoin="round" /*"miter" "round" "bevel"*/
            />
          ))}
          
          {/* Render all stations from all lines */}
          {Object.values(lines).flatMap(lineData => 
            lineData.stations.map((stationId) => {
              const coords = stationCoordinates[stationId];
              if (!coords) return null;
              
              const isTransfer = isTransferStation(stationId);
              const stationLines = getStationLines(stationId);
              const stationName = stationMappings[stationId]?.name || stationId;
              
              return (
                <Group 
                  key={stationId} 
                  x={coords.x} 
                  y={coords.y}
                  onClick={() => {
                    window.scrollTo(0, 0); // Scroll to the top
                    navigate(`/station/${stationId}`); // Redirect
                  }}
                >
                  {isTransfer ? (
                    // For transfer stations, draw multiple circles
                    <>
                      <Circle
                        radius={10}
                        fill="white"
                        stroke="black"
                        strokeWidth={1}
                      />
                      {stationLines.map((lineName, idx) => (
                        <Circle
                          key={idx}
                          radius={8}
                          fill={getLineColor(lineName)}
                          // Create a pie-chart-like effect for lines
                          offsetX={idx % 2 === 0 ? 2 : -2}
                          offsetY={idx < 2 ? 2 : -2}
                        />
                      ))}
                    </>
                  ) : (
                    // Regular stations get a single circle with the line color
                    <Circle
                      radius={6}
                      fill="white"
                      stroke={lineData.color}
                      strokeWidth={2}
                    />
                  )}
                  
                  <Text
                    text={stationName}
                    fontSize={12}
                    fill="black"
                    offsetY={-15}
                  />
                </Group>
              );
            })
          ).filter(Boolean)}
        </Layer>
      </Stage>
    </div>
  );
};

export default TrainMap;