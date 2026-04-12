import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

import { fetchLineStateAll } from '@/shared/api/fetchLineState';
import type { LineState } from '@/shared/types/metro';
import { logger } from '@/shared/utils/logger';

const DEFAULT_LINE_STATES: LineState[] = [
  { name: 'Azul', status: 'Normal', message: '0' },
  { name: 'Amarela', status: 'Normal', message: '0' },
  { name: 'Verde', status: 'Normal', message: '0' },
  { name: 'Vermelha', status: 'Normal', message: '0' },
];

type LineStateContextValue = {
  lineStates: LineState[];
  loading: boolean;
  error: string | null;
};

const LineStateContext = createContext<LineStateContextValue | null>(null);

const LineStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
        logger.error('Failed to fetch line states');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ lineStates, loading, error }), [lineStates, loading, error]);

  return <LineStateContext.Provider value={value}>{children}</LineStateContext.Provider>;
};

const useLineStates = (): LineStateContextValue => {
  const context = useContext(LineStateContext);
  if (!context) {
    throw new Error('useLineStates must be used within a LineStateProvider');
  }
  return context;
};

export { LineStateProvider, useLineStates };
