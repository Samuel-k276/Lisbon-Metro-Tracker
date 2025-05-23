import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Circle, Group, Image, Arrow, Text } from 'react-konva';
import useImage from 'use-image';
import mapaImg from '../assets/mapa.png';
import { useState, useEffect, useMemo, useRef } from 'react';

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
  
  const angle = Math.atan2(nextCoords.y - currentCoords.y, nextCoords.x - currentCoords.x);
  const percentageOfJourney = timeToNext < 240 ? 1 - (timeToNext / 240) : 0;
  const x = currentCoords.x + (nextCoords.x - currentCoords.x) * percentageOfJourney;
  const y = currentCoords.y + (nextCoords.y - currentCoords.y) * percentageOfJourney;
  
  return { x, y, angle };
};

const TrainMap: React.FC<any> = () => {
  const stageRef = useRef<any>(null);
  const dimensions = { width: 1034.4, height: 720 };
  const navigate = useNavigate();
  const [backgroundImage] = useImage(mapaImg);
  const [trainData, setTrainData] = useState<Record<string, Train> | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);
  const [stageScale, _] = useState(1);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Fetch train data when component mounts and every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrainData();
        setTrainData(data);
        setLoadingError(null);
      } catch (error) {
        console.error('Error fetching train data:', error);
        setLoadingError('Falha ao carregar dados dos comboios');
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Mark map as ready when background image loads
  useEffect(() => {
    if (backgroundImage) {
      // Pequeno atraso para garantir que tudo carregou
      const timer = setTimeout(() => setMapReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [backgroundImage]);

  // Memorize train calculations
  const memorizedTrains = useMemo(() => {
    if (!trainData) return [];
    
    const result = [];
    
    for (const [trainId, train] of Object.entries(trainData)) {
      const stationArrivals = Array.from(train.stationArrivals);
      if (stationArrivals.length < 1) continue;
      
      const [waitingTime, stationInfo] = stationArrivals[0];
      const [nextStationId, destinationId] = stationInfo;

      const lineName = getTrainLine(trainId);
      if (lineName === 'Unknown') {
        console.log(`No line found for train ${trainId} at ${nextStationId}`);
        continue;
      }
      
      const directionValue = lines[lineName].destinations[destinationId];
      if (typeof directionValue === 'undefined') {
        console.log(`No direction value found for destination ${destinationId} on line ${lineName}`);
        continue;
      }
      
      const currentIndex = lines[lineName].stations.indexOf(nextStationId);
      if (currentIndex === -1) {
        console.log(`Station ${nextStationId} not found in line ${lineName}`);
        continue;
      }
      
      let nextIndex = currentIndex + (directionValue * -1);
      
      if (nextIndex < 0) {
        nextIndex = 0;
      }

      if (nextIndex >= lines[lineName].stations.length) {
        nextIndex = lines[lineName].stations.length - 1;
      }

      if (nextIndex < 0 || nextIndex >= lines[lineName].stations.length) {
        console.log(`Next station index ${nextIndex} out of bounds for line ${lineName}`);
        continue;
      }
      
      const currentStationId = lines[lineName].stations[nextIndex];
      
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

  // Função para lidar com cliques nas estações
  const handleStationClick = (stationId: string) => {
    window.scrollTo(0, 0);
    navigate(`/station/${stationId}`);
  };

  // Função para lidar com cliques nos comboios
  const handleTrainClick = (trainId: string) => {
    window.scrollTo(0, 0);
    navigate(`/train/${trainId}`);
  };

  return (
    <div 
      className="train-map-container" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {loadingError && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,0,0,0.7)',
          color: 'white',
          padding: 10,
          borderRadius: 5,
          zIndex: 1000
        }}>
          {loadingError}
        </div>
      )}

      <div 
        style={{ 
          position: 'relative', 
          width: dimensions.width, 
          height: dimensions.height
        }}
      >
        {/* Station clickable areas */}
        {mapReady && Object.values(lines).flatMap(lineData => 
          lineData.stations.map((stationId) => {
            const coords = stationCoordinates[stationId];
            if (!coords) return null;
            
            return (
              <div
                key={`overlay-station-${stationId}`}
                onClick={() => handleStationClick(stationId)}
                onMouseEnter={() => setHoveredStation(stationId)}
                onMouseLeave={() => setHoveredStation(null)}
                style={{
                  position: 'absolute',
                  left: coords.x - 15,
                  top: coords.y - 15,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              />
            );
          })
        ).filter(Boolean)}

        {/* Train clickable areas */}
        {mapReady && memorizedTrains.map((train) => (
          <div
            key={`overlay-train-${train.id}`}
            onClick={() => handleTrainClick(train.id)}
            onMouseEnter={() => setHoveredTrain(train.id)}
            onMouseLeave={() => setHoveredTrain(null)}
            style={{
              position: 'absolute',
              left: train.position.x - 15,
              top: train.position.y - 15,
              width: 30,
              height: 30,
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 30
            }}
          />
        ))}

        {/* Konva stage para renderização visual */}
        <Stage 
          ref={stageRef}
          width={dimensions.width} 
          height={dimensions.height}
          scale={{ x: stageScale, y: stageScale }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Background layer */}
          <Layer name="background">
            {backgroundImage && (
              <Image
                image={backgroundImage}
                width={dimensions.width}
                height={dimensions.height}
                scaleX={1}
                scaleY={1}
                listening={false}
              />
            )}
          </Layer>
          
          {/* Stations layer */}
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
                    listening={false}
                  >
                    {stationTransfer ? (
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
                  </Group>
                );
              })
            ).filter(Boolean)}
          </Layer>
          
          {/* Trains layer */}
          <Layer name="trains">
            {memorizedTrains.map((train) => (
              <Group 
                key={`train-${train.id}`}
                x={train.position.x} 
                y={train.position.y}
                listening={false}
              >
                {/* Train circle with enhanced visibility */}
                <Circle
                  radius={hoveredTrain === train.id ? 12 : 10}
                  fill="#ED1C24"
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
                
                {/* Train ID label */}
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
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default TrainMap;