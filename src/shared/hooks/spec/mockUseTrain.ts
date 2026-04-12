import { vi } from 'vitest';

import type { LineNames } from '@/shared/data/metroLines';
import { useTrain } from '@/shared/hooks/useTrain';
import type { Train } from '@/shared/types/metro';

type UseTrainReturn = ReturnType<typeof useTrain>;

const defaultTrainInfo = {
  line: 'Azul' as LineNames,
  lineColor: '#0075BF',
  destination: 'Santa Apolónia',
  nextStations: [
    { stationId: 'SS', stationName: 'São Sebastião', arrivalTime: 60 },
    { stationId: 'PA', stationName: 'Parque', arrivalTime: 180 },
  ],
};

const defaultTrain: Train = {
  id: 'ML001A',
  stationArrivals: [[60, ['SS', 'SP']]],
};

const defaultUseTrainReturn: UseTrainReturn = {
  train: defaultTrain,
  trainInfo: defaultTrainInfo,
  loading: false,
  error: null,
};

const mockUseTrain = (overrides: Partial<UseTrainReturn> = {}) => {
  const value = { ...defaultUseTrainReturn, ...overrides };
  vi.mocked(useTrain).mockReturnValue(value);
  return value;
};

export { mockUseTrain, defaultUseTrainReturn, defaultTrain, defaultTrainInfo };
