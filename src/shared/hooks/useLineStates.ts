import { useState, useEffect } from 'react';

import { fetchLineStateAll } from '@/shared/api/fetchLineState';
import type { LineState } from '@/shared/types/metro';

const DEFAULT_LINE_STATES: LineState[] = [
  { name: 'Azul', status: 'Normal', message: '0' },
  { name: 'Amarela', status: 'Normal', message: '0' },
  { name: 'Verde', status: 'Normal', message: '0' },
  { name: 'Vermelha', status: 'Normal', message: '0' },
];

type UseLineStatesResult = {
  lineStates: LineState[];
  loading: boolean;
  error: string | null;
};

const useLineStates = (): UseLineStatesResult => {
  const [lineStates, setLineStates] = useState<LineState[]>(DEFAULT_LINE_STATES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const states = await fetchLineStateAll();
        if (!cancelled) setLineStates(states.length > 0 ? states : DEFAULT_LINE_STATES);
      } catch {
        if (!cancelled) setError('Erro ao carregar estado das linhas');
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
