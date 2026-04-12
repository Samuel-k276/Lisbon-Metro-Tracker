import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { fetchTrainData } from '../api/metro';
import { Train } from '../types/metro';
import { stationCoordinates, lines } from '../utils/staticData';
import { getTrainLine } from '../utils/metroUtils';

type TrainPosition = {
  id: string;
  line: string;
  position: { x: number; y: number };
  angle: number;
  destination: string;
  waitingTime: number;
  nextStationId: string;
};

type TrainContextValue = {
  trainData: Record<string, Train> | null;
  trainPositions: TrainPosition[];
  loading: boolean;
  error: string | null;
};

const TrainContext = createContext<TrainContextValue | null>(null);

const calculateTrainPosition = (
  currentStationId: string,
  nextStationId: string,
  timeToNext: number,
  stationCoordinates: Record<string, { x: number; y: number }>
): { x: number; y: number; angle: number } => {
  const currentCoords = stationCoordinates[currentStationId];
  const nextCoords = stationCoordinates[nextStationId];

  if (!currentCoords || !nextCoords) {
    return { x: 0, y: 0, angle: 0 };
  }

  const angle = Math.atan2(nextCoords.y - currentCoords.y, nextCoords.x - currentCoords.x);
  const percentageOfJourney = timeToNext < 240 ? 1 - timeToNext / 240 : 0;
  const x = currentCoords.x + (nextCoords.x - currentCoords.x) * percentageOfJourney;
  const y = currentCoords.y + (nextCoords.y - currentCoords.y) * percentageOfJourney;

  return { x, y, angle };
};

const REFRESH_INTERVAL = 10000;

const TrainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trainData, setTrainData] = useState<Record<string, Train> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrainData();
        setTrainData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching train data:', err);
        setError('Falha ao carregar dados dos comboios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const trainPositions = useMemo(() => {
    if (!trainData) return [];

    const result: TrainPosition[] = [];

    for (const [trainId, train] of Object.entries(trainData)) {
      const stationArrivals = Array.from(train.stationArrivals);
      if (stationArrivals.length < 1) continue;

      const [waitingTime, stationInfo] = stationArrivals[0];
      const [nextStationId, destinationId] = stationInfo;

      const lineName = getTrainLine(trainId);
      if (lineName === 'Unknown') continue;

      const directionValue = lines[lineName].destinations[destinationId];
      if (typeof directionValue === 'undefined') continue;

      const currentIndex = lines[lineName].stations.indexOf(nextStationId);
      if (currentIndex === -1) continue;

      let nextIndex = currentIndex + directionValue * -1;
      nextIndex = Math.max(0, Math.min(nextIndex, lines[lineName].stations.length - 1));

      if (nextIndex < 0 || nextIndex >= lines[lineName].stations.length) continue;

      const currentStationId = lines[lineName].stations[nextIndex];
      const { x, y, angle } = calculateTrainPosition(currentStationId, nextStationId, waitingTime, stationCoordinates);

      result.push({
        id: trainId,
        line: lineName,
        position: { x, y },
        angle,
        destination: destinationId,
        waitingTime,
        nextStationId,
      });
    }

    return result;
  }, [trainData]);

  const value = useMemo(
    () => ({ trainData, trainPositions, loading, error }),
    [trainData, trainPositions, loading, error]
  );

  return <TrainContext.Provider value={value}>{children}</TrainContext.Provider>;
};

const useTrains = (): TrainContextValue => {
  const context = useContext(TrainContext);
  if (!context) {
    throw new Error('useTrains must be used within a TrainProvider');
  }
  return context;
};

export { TrainProvider, useTrains };
export type { TrainPosition };
