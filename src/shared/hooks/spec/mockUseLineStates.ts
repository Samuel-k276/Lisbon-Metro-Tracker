import { vi } from 'vitest';

import { useLineStates } from '@/shared/hooks/useLineStates';
import type { LineState } from '@/shared/types/metro';

type UseLineStatesReturn = ReturnType<typeof useLineStates>;

const defaultLineStates: LineState[] = [
  { name: 'Azul', status: 'Normal', message: '0' },
  { name: 'Amarela', status: 'Normal', message: '0' },
  { name: 'Verde', status: 'Conditioned', message: 'Works between Cais do Sodré and Arroios' },
  { name: 'Vermelha', status: 'Normal', message: '0' },
];

const defaultUseLineStatesReturn: UseLineStatesReturn = {
  lineStates: defaultLineStates,
  loading: false,
  error: null,
};

const mockUseLineStates = (overrides: Partial<UseLineStatesReturn> = {}) => {
  const value = { ...defaultUseLineStatesReturn, ...overrides };
  vi.mocked(useLineStates).mockReturnValue(value);
  return value;
};

export { mockUseLineStates, defaultUseLineStatesReturn, defaultLineStates };
