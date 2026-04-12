import React from 'react';
import { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Group, Image as KonvaImage, Arrow, Text } from 'react-konva';

import mapaImg from '@/assets/mapa.png';
import { useTrains } from '@/shared/contexts/TrainContext';
import { stationCoordinates, lines } from '@/shared/data/staticData';
import { useNavigateTo } from '@/shared/hooks/useNavigateTo';
import { stationPath, trainPath } from '@/shared/routes';
import { getStationLines, getLineColor, isTransferStation } from '@/shared/utils/metroUtils';

import styles from './TrainMap.module.scss';

const DIMENSIONS = { width: 1034.4, height: 720 };
const OVERLAY_OFFSET = 15;
const HOVER_COLOR = '#2196F3';

const SHADOW = {
  color: 'rgba(0,0,0,0.3)',
  offset: { x: 0, y: 2 },
  opacity: 0.6,
};

const TRAIN_SHADOW = {
  color: 'rgba(0,0,0,0.5)',
  offset: { x: 0, y: 3 },
  opacity: 0.7,
};

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

      <div className={styles.stageWrapper}>
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
                    style={{ left: coords.x - OVERLAY_OFFSET, top: coords.y - OVERLAY_OFFSET }}
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
                left: train.position.x - OVERLAY_OFFSET,
                top: train.position.y - OVERLAY_OFFSET,
              }}
            />
          ))}

        <Stage width={DIMENSIONS.width} height={DIMENSIONS.height} className={styles.stage}>
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

                  const isHovered = hoveredStation === stationId;
                  const isTransfer = isTransferStation(stationId);
                  const lineColor = getLineColor(getStationLines(stationId)[0] ?? '');

                  return (
                    <Group key={`station-${stationId}`} x={coords.x} y={coords.y} listening={false}>
                      {isTransfer ? (
                        <>
                          <Circle
                            radius={isHovered ? 13 : 10}
                            fill='white'
                            stroke={isHovered ? HOVER_COLOR : lineColor}
                            strokeWidth={isHovered ? 3 : 2}
                            shadowColor={SHADOW.color}
                            shadowBlur={isHovered ? 8 : 4}
                            shadowOffset={SHADOW.offset}
                            shadowOpacity={SHADOW.opacity}
                          />
                          <Circle radius={isHovered ? 11 : 8} fill={lineColor} />
                        </>
                      ) : (
                        <Circle
                          radius={isHovered ? 8 : 6}
                          fill='white'
                          stroke={isHovered ? HOVER_COLOR : lineColor}
                          strokeWidth={isHovered ? 3 : 2}
                          shadowColor={SHADOW.color}
                          shadowBlur={isHovered ? 8 : 4}
                          shadowOffset={SHADOW.offset}
                          shadowOpacity={SHADOW.opacity}
                        />
                      )}
                    </Group>
                  );
                }),
              )
              .filter(Boolean)}
          </Layer>

          <Layer name='trains'>
            {trainPositions.map((train) => {
              const isHovered = hoveredTrain === train.id;

              return (
                <Group
                  key={`train-${train.id}`}
                  x={train.position.x}
                  y={train.position.y}
                  listening={false}
                >
                  <Circle
                    radius={isHovered ? 12 : 10}
                    fill='#ED1C24'
                    stroke='white'
                    strokeWidth={isHovered ? 3 : 1.5}
                    shadowColor={TRAIN_SHADOW.color}
                    shadowBlur={isHovered ? 10 : 5}
                    shadowOffset={TRAIN_SHADOW.offset}
                    shadowOpacity={TRAIN_SHADOW.opacity}
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
                    fontSize={isHovered ? 12 : 10}
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
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export { TrainMap };
