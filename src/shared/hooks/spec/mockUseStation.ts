import { vi } from 'vitest';
import type { Station } from '@/shared/types/metro';
import { useStation } from '@/shared/hooks/useStation';

type UseStationReturn = ReturnType<typeof useStation>;

const defaultStation: Station = {
  id: 'AM',
  name: 'Alameda',
  coordinates: { x: -9.13409, y: 38.7373 },
  lines: ['Verde', 'Vermelha'],
  isTransfer: true,
  isTerminal: false,
  nextTrains: [
    {
      destination: 'Telheiras',
      train1: 'T1',
      time1: '120',
      train2: 'T2',
      time2: '240',
      train3: 'T3',
      time3: '360',
    },
    {
      destination: 'Cais do Sodré',
      train1: 'T4',
      time1: '90',
      train2: '',
      time2: '',
      train3: '',
      time3: '',
    },
  ],
};

const defaultUseStationReturn: UseStationReturn = {
  station: defaultStation,
  loading: false,
  error: null,
};

const mockUseStation = (overrides: Partial<UseStationReturn> = {}) => {
  const value = { ...defaultUseStationReturn, ...overrides };
  vi.mocked(useStation).mockReturnValue(value);
  return value;
};

export { mockUseStation, defaultUseStationReturn, defaultStation };
