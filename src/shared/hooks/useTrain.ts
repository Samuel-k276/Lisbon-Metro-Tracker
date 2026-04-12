import { useMemo } from 'react';
import { useTrains } from '@/shared/contexts/TrainContext';
import { getTrainLine, getStationNameById } from '@/shared/utils/metroUtils';
import { LINE_COLORS, type LineNames } from '@/shared/data/metroLines';
import type { Train } from '@/shared/types/metro';

type TrainInfo = {
  line: string;
  lineColor: string;
  destination: string;
  nextStations: Array<{ stationId: string; stationName: string; arrivalTime: number }>;
};

const buildTrainInfo = (trainId: string, train: Train): TrainInfo | null => {
  const lineName = getTrainLine(trainId);
  const lineColor = LINE_COLORS[lineName as LineNames] || '#888888';

  if (train.stationArrivals.length === 0) return null;

  const firstArrival = train.stationArrivals[0];
  if (!firstArrival) return null;

  const [, [, destinationId]] = firstArrival;

  const nextStations = train.stationArrivals.map(([arrivalTime, stationInfo]) => {
    const [stationId] = stationInfo;
    return {
      stationId,
      stationName: getStationNameById(stationId),
      arrivalTime,
    };
  });

  return {
    line: lineName,
    lineColor,
    destination: getStationNameById(destinationId, ''),
    nextStations,
  };
};

const useTrain = (trainId: string | undefined) => {
  const { trainData, loading, error } = useTrains();

  const train = trainId ? (trainData?.[trainId] ?? null) : null;

  const trainInfo = useMemo(() => {
    if (!trainId || !train) return null;
    return buildTrainInfo(trainId, train);
  }, [trainId, train]);

  const trainError = !loading && trainId && !train ? `Train ${trainId} not found` : error;

  return { train, trainInfo, loading, error: trainError };
};

export { useTrain };
