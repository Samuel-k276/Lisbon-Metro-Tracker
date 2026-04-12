import React from 'react';
import { useNavigateTo } from '@/shared/hooks/useNavigateTo';
import { stationPath, trainPath } from '@/shared/routes';
import { Stage, Layer, Circle, Group, Image as KonvaImage, Arrow, Text } from 'react-konva';
import mapaImg from '@/assets/mapa.png';
import { useState, useEffect } from 'react';

import { stationCoordinates, lines } from '@/shared/data/staticData';
import { getStationLines, getLineColor, isTransferStation } from '@/shared/utils/metroUtils';
import { useTrains } from '@/shared/contexts/TrainContext';
import styles from './TrainMap.module.scss';

const DIMENSIONS = { width: 1034.4, height: 720 };

const TrainMap: React.FC = () => {
  const navigateTo = useNavigateTo();
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);

  const { trainPositions, error: loadingError } = useTrains();

  useEffect(() => {
    const img = new window.Image();
    img.src = mapaImg;
    img.onload = () => setBackgroundImage(img);
    return () => {
      img.onload = null;
    };
  }, []);

  return (
    <div className={styles.container}>
      {loadingError && <div className={styles.errorBanner}>{loadingError}</div>}

      <div
        className={styles.stageWrapper}
        style={{ width: DIMENSIONS.width, height: DIMENSIONS.height }}
      >
        {backgroundImage &&
          Object.values(lines)
            .flatMap((lineData) =>
              lineData.stations.map((stationId) => {
                const coords = stationCoordinates[stationId];
                if (!coords) return null;

                return (
                  <div
                    key={`overlay-station-${stationId}`}
                    onClick={() => navigateTo(stationPath(stationId))}
                    onMouseEnter={() => setHoveredStation(stationId)}
                    onMouseLeave={() => setHoveredStation(null)}
                    className={styles.stationOverlay}
                    style={{
                      left: coords.x - 15,
                      top: coords.y - 15,
                      width: 30,
                      height: 30,
                    }}
                  />
                );
              }),
            )
            .filter(Boolean)}

        {backgroundImage &&
          trainPositions.map((train) => (
            <div
              key={`overlay-train-${train.id}`}
              onClick={() => navigateTo(trainPath(train.id))}
              onMouseEnter={() => setHoveredTrain(train.id)}
              onMouseLeave={() => setHoveredTrain(null)}
              className={styles.trainOverlay}
              style={{
                left: train.position.x - 15,
                top: train.position.y - 15,
                width: 30,
                height: 30,
              }}
            />
          ))}

        <Stage
          width={DIMENSIONS.width}
          height={DIMENSIONS.height}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Layer name='background'>
            {backgroundImage && (
              <KonvaImage
                image={backgroundImage}
                width={DIMENSIONS.width}
                height={DIMENSIONS.height}
                listening={false}
              />
            )}
          </Layer>

          <Layer name='stations'>
            {Object.values(lines)
              .flatMap((lineData) =>
                lineData.stations.map((stationId) => {
                  const coords = stationCoordinates[stationId];
                  if (!coords) return null;

                  const stationTransfer = isTransferStation(stationId);
                  const stationLines = getStationLines(stationId);

                  return (
                    <Group key={`station-${stationId}`} x={coords.x} y={coords.y} listening={false}>
                      {stationTransfer ? (
                        <>
                          <Circle
                            radius={hoveredStation === stationId ? 13 : 10}
                            fill='white'
                            stroke={
                              hoveredStation === stationId
                                ? '#2196F3'
                                : getLineColor(stationLines[0] ?? '')
                            }
                            strokeWidth={hoveredStation === stationId ? 3 : 2}
                            shadowColor='rgba(0,0,0,0.3)'
                            shadowBlur={hoveredStation === stationId ? 8 : 4}
                            shadowOffset={{ x: 0, y: 2 }}
                            shadowOpacity={0.6}
                          />
                          <Circle
                            radius={hoveredStation === stationId ? 11 : 8}
                            fill={getLineColor(stationLines[0] ?? '')}
                          />
                        </>
                      ) : (
                        <Circle
                          radius={hoveredStation === stationId ? 8 : 6}
                          fill='white'
                          stroke={
                            hoveredStation === stationId
                              ? '#2196F3'
                              : getLineColor(stationLines[0] ?? '')
                          }
                          strokeWidth={hoveredStation === stationId ? 3 : 2}
                          shadowColor='rgba(0,0,0,0.3)'
                          shadowBlur={hoveredStation === stationId ? 8 : 4}
                          shadowOffset={{ x: 0, y: 2 }}
                          shadowOpacity={0.6}
                        />
                      )}
                    </Group>
                  );
                }),
              )
              .filter(Boolean)}
          </Layer>

          <Layer name='trains'>
            {trainPositions.map((train) => (
              <Group
                key={`train-${train.id}`}
                x={train.position.x}
                y={train.position.y}
                listening={false}
              >
                <Circle
                  radius={hoveredTrain === train.id ? 12 : 10}
                  fill='#ED1C24'
                  stroke='white'
                  strokeWidth={hoveredTrain === train.id ? 3 : 1.5}
                  shadowColor='rgba(0,0,0,0.5)'
                  shadowBlur={hoveredTrain === train.id ? 10 : 5}
                  shadowOffset={{ x: 0, y: 3 }}
                  shadowOpacity={0.7}
                />
                <Arrow
                  points={[0, 0, Math.cos(train.angle) * 20, Math.sin(train.angle) * 20]}
                  pointerLength={6}
                  pointerWidth={6}
                  fill='white'
                  stroke='white'
                  strokeWidth={2}
                />
                <Text
                  text={train.id.substring(0, 4)}
                  fontSize={hoveredTrain === train.id ? 12 : 10}
                  fontStyle='bold'
                  fill='white'
                  offsetX={-8}
                  offsetY={-12}
                  shadowColor='black'
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

export { TrainMap };
