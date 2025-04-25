import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Stage, Layer, Circle, Group, Image, Arrow, Text } from 'react-konva';
import useImage from 'use-image'; // Adicione esta importação
import mapaImg from '../assets/mapa.png'; // Imagem do mapa
import { useState, useEffect, useMemo } from 'react';

import { stationMappings } from '../utils/stationMappings';
import { stationCoordinates, lines, getTrainLine } from '../utils/staticData';
import { fetchTrainData } from '../api/metro';
import { Train } from '../types/metro';

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

// Helper to calculate train position
const calculateTrainPosition = (currentStationId: string, nextStationId: string, timeToNext: number): { x: number, y: number, angle: number } => {
  const currentCoords = stationCoordinates[currentStationId];
  const nextCoords = stationCoordinates[nextStationId];
  
  if (!currentCoords || !nextCoords) {
    return { x: 0, y: 0, angle: 0 };
  }
  
  // Calculate angle for the arrow (in radians)
  const angle = Math.atan2(nextCoords.y - currentCoords.y, nextCoords.x - currentCoords.x);
  
  // Calculate midpoint between the two stations
  // Calculate position based on time
  // timeToNext is the remaining time to next station (in seconds)
  // 240 seconds = 100% of the distance, so we calculate the percentage of distance covered
  const percentageOfJourney = 1 - (timeToNext / 240); // Invert because less time means closer to next station
  
  // Interpolate between current and next coordinates based on percentage
  const x = currentCoords.x + (nextCoords.x - currentCoords.x) * percentageOfJourney;
  const y = currentCoords.y + (nextCoords.y - currentCoords.y) * percentageOfJourney;
  
  return { x, y, angle };
};

const TrainMap: React.FC<any> = () => {
  const dimensions = { width: 1034.4, height: 720 };
  const navigate = useNavigate(); // Initialize navigate
  const [backgroundImage] = useImage(mapaImg); // Use o caminho correto da imagem
  const [trainData, setTrainData] = useState<Record<string, Train> | null>(null); // State to store train data
  const [hoveredStation, setHoveredStation] = useState<string | null>(null); // State to track hovered station
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null); // State to track hovered train

  // Get color for the line
  const getLineColor = (lineName: string) => {
    return lines[lineName].color || "#888888"; // Default to gray if color not found
  };

  // Fetch train data when the component mounts and every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrainData(); // Fetch train data from the API
        setTrainData(data); // Store the returned data
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };

    fetchData(); // Fetch data immediately
    const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Memorize train calculations to avoid recalculations on hover
  const memorizedTrains = useMemo(() => {
    // Extract renderableTrains calculation logic
    if (!trainData) return [];
    
    const result = [];
    
    for (const [trainId, train] of Object.entries(trainData)) {
      // Get first entry from stationArrivals which is sorted by time
      const stationArrivals = Array.from(train.stationArrivals);
      if (stationArrivals.length < 1) continue;
      
      // Get the current waiting time and station ID
      const [waitingTime, stationInfo] = stationArrivals[0];
      const [nextStationId, destinationId] = stationInfo;
         
      // Find which line this train belongs to based on the current station
      const lineName = getTrainLine(trainId);
      if (!lineName) {
        console.log(`No line found for train ${trainId} at ${nextStationId}`);
        continue;
      }
      
      // Find the destination direction
      const directionValue = lines[lineName].destinations[destinationId];
      if (typeof directionValue === 'undefined') {
        console.log(`No direction value found for destination ${destinationId} on line ${lineName}`);
        continue;
      }
      
      // Find the index of the current station in the line
      const currentIndex = lines[lineName].stations.indexOf(nextStationId);
      if (currentIndex === -1) {
        console.log(`Station ${nextStationId} not found in line ${lineName}`);
        continue;
      }
      
      // Calculate the index of the next station based on direction
      let nextIndex = currentIndex + (directionValue * -1);
      
      // Ensure we don't go out of bounds
      if (nextIndex < 0) {
        nextIndex = 0;
      }

      if (nextIndex >= lines[lineName].stations.length) {
        nextIndex = lines[lineName].stations.length - 1;
      }

      // Ensure we have a valid next station
      if (nextIndex < 0 || nextIndex >= lines[lineName].stations.length) {
        console.log(`Next station index ${nextIndex} out of bounds for line ${lineName}`);
        continue;
      }
      
      const currentStationId = lines[lineName].stations[nextIndex];
      
      // Calculate position for the train
      const { x, y, angle } = calculateTrainPosition(currentStationId, nextStationId, waitingTime);
      
      result.push({
        id: trainId,
        line: lineName,
        position: { x, y },
        angle: angle,
        destination: destinationId,
        waitingTime: waitingTime,
        nextStationId: nextStationId
      });
    }
    
    return result;
    
  }, [trainData]); // Only recalculate when trainData changes

  return (
    <div className="train-map" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Background Image - ajustada para caber completamente */}
          {backgroundImage && (
            <Image
              image={backgroundImage}
              width={dimensions.width}
              height={dimensions.height}
              scaleX={1}
              scaleY={1}
            />
          )}
          
          {/* Render all stations from all lines */}
          {Object.values(lines).flatMap(lineData => 
            lineData.stations.map((stationId) => {
              const coords = stationCoordinates[stationId];
              if (!coords) return null;
              
              const isTransfer = isTransferStation(stationId);
              const stationLines = getStationLines(stationId);
              
              return (
                <Group 
                  key={stationId} 
                  x={coords.x} 
                  y={coords.y}
                  onClick={() => {
                    window.scrollTo(0, 0); // Scroll to the top
                    navigate(`/station/${stationId}`); // Redirect
                  }}
                  onMouseEnter={() => setHoveredStation(stationId)}
                  onMouseLeave={() => setHoveredStation(null)}
                  cursor="pointer"
                >
                  {isTransfer ? (
                    // For transfer stations, draw a circle with the color of the first line only
                    <>
                      <Circle
                        radius={hoveredStation === stationId ? 13 : 10}
                        fill="white"
                        stroke={hoveredStation === stationId ? "#2196F3" : getLineColor(stationLines[0])}
                        strokeWidth={hoveredStation === stationId ? 2.5 : 1}
                        shadowColor={hoveredStation === stationId ? "rgba(0,0,0,0.5)" : "transparent"}
                        shadowBlur={hoveredStation === stationId ? 6 : 0}
                        shadowOffset={hoveredStation === stationId ? { x: 0, y: 2 } : { x: 0, y: 0 }}
                        shadowOpacity={0.6}
                      />
                      <Circle
                        radius={hoveredStation === stationId ? 11 : 8}
                        fill={getLineColor(stationLines[0])} // Use only the first line color
                      />
                    </>
                  ) : (
                    // Regular stations get a single circle with the line color
                    <Circle
                      radius={hoveredStation === stationId ? 8 : 6}
                      fill="white"
                      stroke={hoveredStation === stationId ? "#2196F3" : lineData.color}
                      strokeWidth={hoveredStation === stationId ? 2.5 : 2}
                      shadowColor={hoveredStation === stationId ? "rgba(0,0,0,0.5)" : "transparent"}
                      shadowBlur={hoveredStation === stationId ? 5 : 0}
                      shadowOffset={hoveredStation === stationId ? { x: 0, y: 2 } : { x: 0, y: 0 }}
                      shadowOpacity={0.6}
                    />
                  )}
                </Group>
              );
            })
          ).filter(Boolean)}
          
          {/* Render trains */}
          {memorizedTrains.map((train) => (
            <Group 
              key={train.id} 
              x={train.position.x} 
              y={train.position.y}
              onClick={() => {
                window.scrollTo(0, 0); // Scroll to the top
                navigate(`/train/${train.id}`); // Redirect to train detail page
              }}
              onMouseEnter={() => setHoveredTrain(train.id)}
              onMouseLeave={() => setHoveredTrain(null)}
              cursor="pointer"
            >
              {/* Train circle */}
              <Circle
                radius={hoveredTrain === train.id ? 10 : 8}
                fill="#ED1C24" // Red color for trains
                stroke="white"
                strokeWidth={hoveredTrain === train.id ? 2.5 : 1.5}
                shadowColor={hoveredTrain === train.id ? "rgba(0,0,0,0.5)" : "transparent"}
                shadowBlur={hoveredTrain === train.id ? 5 : 0}
                shadowOffset={hoveredTrain === train.id ? { x: 0, y: 2 } : { x: 0, y: 0 }}
                shadowOpacity={0.6}
              />
              
              {/* Direction arrow */}
              <Arrow
                points={[0, 0, Math.cos(train.angle) * 20, Math.sin(train.angle) * 20]}
                pointerLength={5}
                pointerWidth={5}
                fill="white"
                stroke="white"
                strokeWidth={2}
              />
              
              {/* Train ID label - small and subtle */}
              <Text
                text={train.id.substring(0, 4)}
                fontSize={hoveredTrain === train.id ? 10 : 8}
                fontStyle={hoveredTrain === train.id ? 'bold' : 'normal'}
                fill={hoveredTrain === train.id ? "black" : "#333"}
                offsetX={-8}
                offsetY={-12}
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default TrainMap;