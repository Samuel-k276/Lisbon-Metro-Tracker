import { useState, useEffect, useCallback } from 'react';

import { fetchStationWaitingTimes } from '@/shared/api/fetchStationWaitingTimes';
import { stationMappings } from '@/shared/data/stationMappings';
import type { Station } from '@/shared/types/metro';

type UseStationResult = {
  station: Station | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

const useStation = (stationId: string | undefined): UseStationResult => {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  useEffect(() => {
    if (!stationId) {
      setLoading(false);
      setError('Estação não encontrada');
      return;
    }

    let cancelled = false;

    const getStationData = async () => {
      setLoading(true);
      setError(null);

      const data = await fetchStationWaitingTimes(stationId);

      if (cancelled) return;

      if (data) {
        setStation(data);
      } else {
        const name = stationMappings[stationId]?.name ?? stationId;
        setError(`Erro ao carregar a estação ${name}`);
        setStation(null);
      }

      setLoading(false);
    };

    getStationData();

    return () => {
      cancelled = true;
    };
  }, [stationId, retryCount]);

  return { station, loading, error, retry };
};

export { useStation };
export type { UseStationResult };
