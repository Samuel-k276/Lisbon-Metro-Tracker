import { useMemo } from 'react';

import { useTrains } from '@/shared/contexts/TrainContext';
import { stationMappings, getDestinationNameById } from '@/shared/data/stationMappings';
import type { Station, NextTrainsResponse } from '@/shared/types/metro';

type UseStationResult = {
  station: Station | null;
  loading: boolean;
  error: string | null;
};

const buildNextTrains = (
  stationId: string,
  trainData: Record<string, { stationArrivals: [number, [string, string]][] }>,
): NextTrainsResponse[] => {
  // Group arrivals at this station by destination
  const byDestination = new Map<string, { trainId: string; time: number }[]>();

  for (const [trainId, train] of Object.entries(trainData)) {
    for (const [arrivalTime, [arrStationId, destinationId]] of train.stationArrivals) {
      if (arrStationId !== stationId) continue;

      const existing = byDestination.get(destinationId) ?? [];
      existing.push({ trainId, time: arrivalTime });
      byDestination.set(destinationId, existing);
    }
  }

  // Build NextTrainsResponse per destination (up to 3 trains)
  const result: NextTrainsResponse[] = [];

  for (const [destinationId, arrivals] of byDestination) {
    const sorted = arrivals.sort((a, b) => a.time - b.time);
    const destName = getDestinationNameById(destinationId, stationId);

    result.push({
      destination: destName,
      train1: sorted[0]?.trainId ?? '',
      time1: sorted[0]?.time.toString() ?? '',
      train2: sorted[1]?.trainId ?? '',
      time2: sorted[1]?.time.toString() ?? '',
      train3: sorted[2]?.trainId ?? '',
      time3: sorted[2]?.time.toString() ?? '',
    });
  }

  // For terminal stations, filter out self-destination
  const stationName = stationMappings[stationId]?.name;
  if (stationMappings[stationId]?.isTerminal && stationName) {
    return result.filter((t) => t.destination !== stationName);
  }

  return result;
};

const useStation = (stationId: string | undefined): UseStationResult => {
  const { trainData, loading, error } = useTrains();

  const station = useMemo(() => {
    if (!stationId) return null;

    const mapping = stationMappings[stationId];
    if (!mapping) return null;

    const nextTrains = trainData ? buildNextTrains(stationId, trainData) : [];

    return {
      id: stationId,
      name: mapping.name,
      coordinates: mapping.coordinates,
      lines: mapping.lines,
      isTransfer: mapping.isTransfer,
      isTerminal: mapping.isTerminal,
      nextTrains,
    } satisfies Station;
  }, [stationId, trainData]);

  const stationError =
    !loading && stationId && !stationMappings[stationId] ? `Estação não encontrada` : error;

  return { station, loading, error: stationError };
};

export { useStation };
export type { UseStationResult };
