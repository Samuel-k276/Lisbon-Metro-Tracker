import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Circle, Group, Image, Arrow, Text } from 'react-konva';
import useImage from 'use-image';
import mapaImg from '../assets/mapa.png'; // Imagem do mapa
import { useState, useEffect, useMemo } from 'react';

import { stationCoordinates, lines } from '../utils/staticData';
import { getStationLines, getTrainLine, getLineColor, isTransferStation } from '../utils/metroUtils';
import { fetchTrainData } from '../api/metro';
import { Train } from '../types/metro';

// Helper to calculate train position
const calculateTrainPosition = (currentStationId: string, nextStationId: string, timeToNext: number): { x: number, y: number, angle: number } => {
  const currentCoords = stationCoordinates[currentStationId];
  const nextCoords = stationCoordinates[nextStationId];
  
  if (!currentCoords || !nextCoords) {
    return { x: 0, y: 0, angle: 0 };
  }
  
  // Calculate angle for the arrow (in radians)
  const angle = Math.atan2(nextCoords.y - currentCoords.y, nextCoords.x - currentCoords.x);
  
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
  const navigate = useNavigate();
  const [backgroundImage] = useImage(mapaImg);
  const [trainData, setTrainData] = useState<Record<string, Train> | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);
  const [stageScale, _] = useState(1);
  const [debug, setDebug] = useState(false); // Para debugging quando necessário

  // Fetch train data when the component mounts and every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrainData();
        setTrainData(data);
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Memorize train calculations to avoid recalculations on hover
  const memorizedTrains = useMemo(() => {
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
      if (lineName === 'Unknown') {
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
  }, [trainData]);

  // Função de ajuda para ativar debug mode
  const toggleDebug = () => {
    setDebug(!debug);
  };

  // Adicionar event listener para debug com Ctrl+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDebug();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debug]);

  return (
    <div className="train-map" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      touchAction: 'none',
      position: 'relative',
      cursor: 'default'
    }}>
      {/* Se debug estiver ativo, mostrar contadores */}
      {debug && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: 10,
          borderRadius: 5,
          zIndex: 1000
        }}>
          <div>Estações: {Object.values(lines).flatMap(l => l.stations).length}</div>
          <div>Comboios: {memorizedTrains.length}</div>
        </div>
      )}
      
      <Stage 
        width={dimensions.width} 
        height={dimensions.height}
        scale={{ x: stageScale, y: stageScale }}
      >
        {/* Camada do fundo - apenas a imagem */}
        <Layer name="background">
          {backgroundImage && (
            <Image
              image={backgroundImage}
              width={dimensions.width}
              height={dimensions.height}
              scaleX={1}
              scaleY={1}
              listening={false} // A imagem do fundo não deve capturar eventos
            />
          )}
        </Layer>
        
        {/* Camada das estações - boa para interatividade */}
        <Layer name="stations">
          {Object.values(lines).flatMap(lineData => 
            lineData.stations.map((stationId) => {
              const coords = stationCoordinates[stationId];
              if (!coords) return null;
              
              const stationTransfer = isTransferStation(stationId);
              const stationLines = getStationLines(stationId);
              
              return (
                <Group 
                  key={`station-${stationId}`}
                  x={coords.x} 
                  y={coords.y}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    window.scrollTo(0, 0);
                    navigate(`/station/${stationId}`);
                  }}
                  onTap={() => {
                    window.scrollTo(0, 0);
                    navigate(`/station/${stationId}`);
                  }}
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) {
                      stage.container().style.cursor = 'pointer';
                    }
                    setHoveredStation(stationId);
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage) {
                      stage.container().style.cursor = 'default';
                    }
                    setHoveredStation(null);
                  }}
                  hitStrokeWidth={25} // Área de clique ainda maior
                >
                  {stationTransfer ? (
                    // For transfer stations, draw a circle with the color of the first line only
                    <>
                      <Circle
                        radius={hoveredStation === stationId ? 13 : 10}
                        fill="white"
                        stroke={hoveredStation === stationId ? "#2196F3" : getLineColor(stationLines[0])}
                        strokeWidth={hoveredStation === stationId ? 3 : 2}
                        shadowColor="rgba(0,0,0,0.3)"
                        shadowBlur={hoveredStation === stationId ? 8 : 4}
                        shadowOffset={{ x: 0, y: 2 }}
                        shadowOpacity={0.6}
                      />
                      <Circle
                        radius={hoveredStation === stationId ? 11 : 8}
                        fill={getLineColor(stationLines[0])}
                      />
                    </>
                  ) : (
                    // Regular stations get a single circle with the line color
                    <Circle
                      radius={hoveredStation === stationId ? 8 : 6}
                      fill="white"
                      stroke={hoveredStation === stationId ? "#2196F3" : getLineColor(stationLines[0])}
                      strokeWidth={hoveredStation === stationId ? 3 : 2}
                      shadowColor="rgba(0,0,0,0.3)"
                      shadowBlur={hoveredStation === stationId ? 8 : 4}
                      shadowOffset={{ x: 0, y: 2 }}
                      shadowOpacity={0.6}
                    />
                  )}
                  
                  {/* Adicionar um círculo transparente maior para aumentar a área de clique */}
                  <Circle
                    radius={20}
                    fill="transparent"
                  />
                  
                  {/* Em debug mode, mostrar IDs das estações */}
                  {debug && (
                    <Text
                      text={stationId}
                      fontSize={10}
                      fill="black"
                      offsetX={0}
                      offsetY={-20}
                    />
                  )}
                </Group>
              );
            })
          ).filter(Boolean)}
        </Layer>
        
        {/* Camada dos comboios - fica por cima de tudo */}
        <Layer name="trains">
          {memorizedTrains.map((train) => (
            <Group 
              key={`train-${train.id}`}
              x={train.position.x} 
              y={train.position.y}
              onClick={(e) => {
                e.cancelBubble = true;
                window.scrollTo(0, 0);
                navigate(`/train/${train.id}`);
              }}
              onTap={() => {
                window.scrollTo(0, 0);
                navigate(`/train/${train.id}`);
              }}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                  stage.container().style.cursor = 'pointer';
                }
                setHoveredTrain(train.id);
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                  stage.container().style.cursor = 'default';
                }
                setHoveredTrain(null);
              }}
              hitStrokeWidth={25} // Área de clique ainda maior
            >
              {/* Círculo transparente maior para aumentar a área de clique */}
              <Circle
                radius={20}
                fill="transparent"
              />
              
              {/* Train circle with enhanced visibility */}
              <Circle
                radius={hoveredTrain === train.id ? 12 : 10}
                fill="#ED1C24" // Vermelho para comboios
                stroke="white"
                strokeWidth={hoveredTrain === train.id ? 3 : 1.5}
                shadowColor="rgba(0,0,0,0.5)"
                shadowBlur={hoveredTrain === train.id ? 10 : 5}
                shadowOffset={{ x: 0, y: 3 }}
                shadowOpacity={0.7}
              />
              
              {/* Direction arrow */}
              <Arrow
                points={[0, 0, Math.cos(train.angle) * 20, Math.sin(train.angle) * 20]}
                pointerLength={6}
                pointerWidth={6}
                fill="white"
                stroke="white"
                strokeWidth={2}
              />
              
              {/* Train ID label - clearer and more visible */}
              <Text
                text={train.id.substring(0, 4)}
                fontSize={hoveredTrain === train.id ? 12 : 10}
                fontStyle="bold"
                fill="white"
                offsetX={-8}
                offsetY={-12}
                shadowColor="black"
                shadowBlur={3}
                shadowOffset={{ x: 1, y: 1 }}
                shadowOpacity={0.8}
              />
              
              {/* Debug info */}
              {debug && (
                <Text
                  text={`Dest: ${train.destination}`}
                  fontSize={9}
                  fill="black"
                  offsetX={0}
                  offsetY={20}
                />
              )}
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default TrainMap;