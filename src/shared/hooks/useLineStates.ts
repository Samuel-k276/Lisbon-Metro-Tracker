import { useState, useEffect } from 'react';
import type { LineState } from '@/shared/types/metro';
import { fetchLineStateAll } from '@/shared/api/fetchLineState';

type UseLineStatesResult = {
  lineStates: LineState[];
  loading: boolean;
  error: string | null;
};

const useLineStates = (): UseLineStatesResult => {
  const [lineStates, setLineStates] = useState<LineState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const states = await fetchLineStateAll();
        if (!cancelled) setLineStates(states);
      } catch {
        if (!cancelled) setError('Failed to fetch line states');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { lineStates, loading, error };
};

export { useLineStates };
export type { UseLineStatesResult };
