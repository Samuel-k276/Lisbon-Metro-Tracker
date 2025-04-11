import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Stage, Layer, Circle, Text, Line as KonvaLine, Group } from 'react-konva';
import { Coordinates } from '../types/metro';
import { stationMappings } from '../utils/stationMappings';

// Map metro line names to colors
const lineColors: Record<string, string> = {
  'Azul': '#0075BF',
  'Amarela': '#FFD800',
  'Verde': '#00A9A6',
  'Vermelha': '#ED1C24'
};

// Corrected station coordinates for rendering (normalized to fit within 1000x800 canvas)
const stationCoordinates: Record<string, Coordinates> = {
  'RB': { x: 18, y: 200 },
  'AS': { x: 77, y: 200 },
  'AF': { x: 137, y: 200 },
  'PO': { x: 198, y: 208 },
  'CA': { x: 233, y: 243 },
  'CM': { x: 268, y: 278 },
  'AH': { x: 303, y: 313 },
  'LA': { x: 338, y: 348 },
  'JZ': { x: 373, y: 383 },
  'PE': { x: 424, y: 434 },
  'PA': { x: 514, y: 524 },
  'MP': { x: 553, y: 563 },
  'AV': { x: 594, y: 604 },
  'RE': { x: 639, y: 649 },
  'BC': { x: 676, y: 686 },
  'TP': { x: 754, y: 722 },
  'SP': { x: 842, y: 722 },
  'OD': { x: 553, y: 50 },
  'SR': { x: 553, y: 100 },
  'AX': { x: 553, y: 150 },
  'LU': { x: 553, y: 200 },
  'QC': { x: 553, y: 250 },
  'CG': { x: 553, y: 300 },
  'CU': { x: 553, y: 350 },
  'EC': { x: 553, y: 395 },
  'CP': { x: 553, y: 440 },
  'SA': { x: 553, y: 484 },
  'PI': { x: 553, y: 524 },
  'RA': { x: 535, y: 615 },
  'TE': { x: 497, y: 300 },
  'AL': { x: 676, y: 303 },
  'RM': { x: 676, y: 362 },
  'AE': { x: 676, y: 404 },
  'AM': { x: 676, y: 484 },
  'AR': { x: 676, y: 524 },
  'AN': { x: 676, y: 557 },
  'IN': { x: 676, y: 589 },
  'MM': { x: 676, y: 620 },
  'RO': { x: 676, y: 651 },
  'CS': { x: 604, y: 722 },
  'AP': { x: 729, y: 204 },
  'EN': { x: 796, y: 204 },
  'MO': { x: 863, y: 204 },
  'OR': { x: 913, y: 273 },
  'CR': { x: 885, y: 337 },
  'OS': { x: 853, y: 368 },
  'CH': { x: 818, y: 402 },
  'BV': { x: 786, y: 434 },
  'OL': { x: 755, y: 465 },
  'SS': { x: 474, y: 484 }
};

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

interface TrainMapProps {
  // No props needed as we're using the predefined lines
}

// Updated lines with stations in correct order from one terminal to another
const lines = [
  { 
    line: 'Azul', 
    stations: [
      'RB', 'AS', 'AF', 'PO', 'CA', 'CM', 'AH', 'LA', 'JZ', 'PE', 'PA', 'MP', 
      'AV', 'RE', 'BC', 'TP', 'SP'
    ]
  },
  { 
    line: 'Amarela', 
    stations: [
      'OD', 'SR', 'AX', 'LU', 'QC', 'CG', 'CU', 'EC', 'CP', 'SA', 'PI', 'MP', 'RA'
    ]
  },
  { 
    line: 'Verde', 
    stations: [
      'TE', 'CG', 'AL', 'RM', 'AE', 'AM', 'AR', 'AN', 'IN', 'MM', 'RO', 'BC', 'CS'
    ]
  },
  { 
    line: 'Vermelha', 
    stations: [
      'AP', 'EN', 'MO', 'OR', 'CR', 'OS', 'CH', 'BV', 'OL', 'AM', 'SA', 'SS'
    ]
  }
];

const TrainMap: React.FC<TrainMapProps> = () => {
  const [dimensions, _] = useState({ width: 1000, height: 800 });
  const navigate = useNavigate(); // Initialize navigate

  // Generate line path points for a specific line
  const generateLinePath = (_: string, stationIds: string[]) => {
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
    return lineColors[lineName] || '#888888'; // Default to gray if color not found
  };

  return (
    <div className="train-map">
      <h3>Lisbon Metro Map</h3>
      
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Draw all line paths */}
          {lines.map((lineData, idx) => (
            <KonvaLine
              key={`line-${idx}`}
              points={generateLinePath(lineData.line, lineData.stations)}
              stroke={getLineColor(lineData.line)}
              strokeWidth={4}
              tension={0.3}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          
          {/* Render all stations from all lines */}
          {lines.flatMap(lineData => 
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
                      stroke={getLineColor(lineData.line)}
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