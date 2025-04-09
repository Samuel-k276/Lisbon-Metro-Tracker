import { useState, useEffect } from 'react';
import { Station } from '../types/metro';
import { fetchStationWaitingTimes } from '../api/metro'; // Adjust the import path as necessary

export const useStation = (stationId: string | undefined) => {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) {
      setLoading(false);
      setError('No station ID provided');
      return;
    }

    const getStationData = async () => {
      try {
        setLoading(true);
        const data = await fetchStationWaitingTimes(stationId);
        setStation(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStation(null);
      } finally {
        setLoading(false);
      }
    };

    getStationData();
  }, [stationId]);

  return { station, loading, error };
};
