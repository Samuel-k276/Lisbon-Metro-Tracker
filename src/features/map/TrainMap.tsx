import React from 'react';
import { useState } from 'react';

import mapaImg from '@/assets/mapa.png';
import { useTrains } from '@/shared/contexts/TrainContext';
import { stationCoordinates, lines } from '@/shared/data/staticData';
import { useNavigateTo } from '@/shared/hooks/useNavigateTo';
import { stationPath, trainPath } from '@/shared/routes';
import { getStationLines, getLineColor, isTransferStation } from '@/shared/utils/metroUtils';

import { StationMarker } from './StationMarker';
import { TrainMarker } from './TrainMarker';

import styles from './TrainMap.module.scss';

const DIMENSIONS = { width: 1034.4, height: 720 };
const HOVER_COLOR = '#2196F3';

const ALL_STATION_IDS = [...new Set(Object.values(lines).flatMap((line) => line.stations))];

const handleKeyNav = (callback: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

const TrainMap: React.FC = () => {
  const navigateTo = useNavigateTo();
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);

  const { trainPositions, error: loadingError } = useTrains();

  return (
    <div className={styles.container}>
      {loadingError && <div className={styles.errorBanner}>{loadingError}</div>}

      <svg
        className={styles.map}
        viewBox={`0 0 ${DIMENSIONS.width} ${DIMENSIONS.height}`}
        role='img'
        aria-label='Lisbon Metro map with real-time train positions'
      >
        <defs>
          <filter id='station-shadow'>
            <feDropShadow
              dx='0'
              dy='2'
              stdDeviation='2'
              floodColor='rgba(0,0,0,0.3)'
              floodOpacity='0.6'
            />
          </filter>
          <filter id='station-shadow-hover'>
            <feDropShadow
              dx='0'
              dy='2'
              stdDeviation='4'
              floodColor='rgba(0,0,0,0.3)'
              floodOpacity='0.6'
            />
          </filter>
          <filter id='train-shadow'>
            <feDropShadow
              dx='0'
              dy='3'
              stdDeviation='2.5'
              floodColor='rgba(0,0,0,0.5)'
              floodOpacity='0.7'
            />
          </filter>
          <filter id='train-shadow-hover'>
            <feDropShadow
              dx='0'
              dy='3'
              stdDeviation='5'
              floodColor='rgba(0,0,0,0.5)'
              floodOpacity='0.7'
            />
          </filter>
          <filter id='text-shadow'>
            <feDropShadow dx='1' dy='1' stdDeviation='1.5' floodColor='black' floodOpacity='0.8' />
          </filter>
        </defs>

        <image href={mapaImg} width={DIMENSIONS.width} height={DIMENSIONS.height} />

        <g>
          {ALL_STATION_IDS.map((stationId) => {
            const coords = stationCoordinates[stationId];
            if (!coords) return null;

            const navigate = () => navigateTo(stationPath(stationId));

            return (
              <g
                key={stationId}
                className={styles.station}
                onClick={navigate}
                onKeyDown={handleKeyNav(navigate)}
                onMouseEnter={() => setHoveredStation(stationId)}
                onMouseLeave={() => setHoveredStation(null)}
                tabIndex={0}
                role='link'
                aria-label={`Station ${stationId}`}
              >
                <StationMarker
                  cx={coords.x}
                  cy={coords.y}
                  lineColor={getLineColor(getStationLines(stationId)[0] ?? '')}
                  isTransfer={isTransferStation(stationId)}
                  isHovered={hoveredStation === stationId}
                  hoverColor={HOVER_COLOR}
                />
              </g>
            );
          }).filter(Boolean)}
        </g>

        <g>
          {trainPositions.map((train) => {
            const navigate = () => navigateTo(trainPath(train.id));

            return (
              <g
                key={train.id}
                className={styles.train}
                onClick={navigate}
                onKeyDown={handleKeyNav(navigate)}
                onMouseEnter={() => setHoveredTrain(train.id)}
                onMouseLeave={() => setHoveredTrain(null)}
                tabIndex={0}
                role='link'
                aria-label={`Train ${train.id}`}
              >
                <TrainMarker
                  cx={train.position.x}
                  cy={train.position.y}
                  angle={train.angle}
                  label={train.id.substring(0, 4)}
                  isHovered={hoveredTrain === train.id}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export { TrainMap };
