import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Stage, Layer, Circle, Group, Image, Arrow, Text } from 'react-konva';
import useImage from 'use-image'; // Adicione esta importação
import mapaImg from '../assets/mapa.png'; // Imagem do mapa
import { useState, useEffect } from 'react';

import { stationMappings } from '../utils/stationMappings';
import { stationCoordinates, lines } from '../utils/staticData';
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

// Helper to find which line a station belongs to
const getStationLine = (destinationId: string, nextStationId: string): string | null => {
  const destinationToLine = stationMappings[destinationId]?.lines || null;
  const nextStationToLine = stationMappings[nextStationId]?.lines || null;
  
  if (!destinationToLine || !nextStationToLine) return null;

  // Return the common line between the two stations
  for (const line of destinationToLine) {
    if (nextStationToLine.includes(line)) {
      return line;
    }
  }

  // If no common line is found, return null
  // This should not happen if the data is correct
  return null;
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

  // Prepare train data for rendering
  const renderableTrains = () => {
    if (!trainData) return [];
    
    const result = [];
    
    for (const [trainId, train] of Object.entries(trainData)) {
      // Get first entry from stationArrivals which is sorted by time
      const stationArrivals = Array.from(train.stationArrivals);
      if (stationArrivals.length < 1) continue;
      
      // Get the current waiting time and station ID
      const [waitingTime, nextStationId] = stationArrivals[0];
         
      // Find which line this train belongs to based on the current station
      const lineName = getStationLine(train.destination, nextStationId);
      if (!lineName) {
        console.log(`No line found for train ${trainId} between ${train.destination} and ${nextStationId}`);
        continue;
      }
      
      // Find the destination direction
      const destination = train.destination;
      const directionValue = lines[lineName].destinations[destination];
      if (typeof directionValue === 'undefined') {
        console.log(`No direction value found for destination ${destination} on line ${lineName}`);
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
        destination: destination,
        waitingTime: waitingTime,
        nextStationId: nextStationId
      });
    }
    
    console.log('Train data prepared for rendering:', result);
    return result;
  };


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
                </Group>
              );
            })
          ).filter(Boolean)}
          
          {/* Render trains */}
          {renderableTrains().map((train) => (
            <Group key={train.id} x={train.position.x} y={train.position.y}>
              {/* Train circle */}
              <Circle
                radius={8}
                fill="#ED1C24" // Red color for trains
                stroke="white"
                strokeWidth={1.5}
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
                fontSize={8}
                fill="black"
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