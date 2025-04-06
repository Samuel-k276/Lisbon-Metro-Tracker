import { useState, useEffect } from 'react';
import { Station } from '../types/metro';

// You would typically replace this with an API call to your backend
const fetchStation = async (stationId: string): Promise<Station> => {
  // This is a mock implementation
  // Replace with your actual API call
  const response = await fetch(`/api/stations/${stationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch station data');
  }
  return response.json();
};

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
        const data = await fetchStation(stationId);
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
