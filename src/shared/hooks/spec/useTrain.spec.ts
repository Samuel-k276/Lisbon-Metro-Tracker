import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/contexts/TrainContext');

import { useTrains } from '@/shared/contexts/TrainContext';
import { useTrain } from '@/shared/hooks/useTrain';
import type { Train } from '@/shared/types/metro';

const mockUseTrains = vi.mocked(useTrains);

const mockTrain: Train = {
  id: 'ML001A',
  stationArrivals: [
    [60, ['SS', 'SP']],
    [180, ['PA', 'SP']],
  ],
};

describe('useTrain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTrains.mockReturnValue({
      trainData: { ML001A: mockTrain },
      trainPositions: [],
      loading: false,
      error: null,
    });
  });

  it('returns train data for valid ID', () => {
    const { result } = renderHook(() => useTrain('ML001A'));
    expect(result.current.train).toEqual(mockTrain);
    expect(result.current.trainInfo).not.toBeNull();
    expect(result.current.trainInfo?.line).toBe('Azul');
    expect(result.current.loading).toBe(false);
  });

  it('returns null train for unknown ID', () => {
    const { result } = renderHook(() => useTrain('UNKNOWN'));
    expect(result.current.train).toBeNull();
    expect(result.current.trainInfo).toBeNull();
    expect(result.current.error).toBe('Train UNKNOWN not found');
  });

  it('returns null for undefined ID', () => {
    const { result } = renderHook(() => useTrain(undefined));
    expect(result.current.train).toBeNull();
    expect(result.current.trainInfo).toBeNull();
  });

  it('passes through loading state', () => {
    mockUseTrains.mockReturnValue({
      trainData: null,
      trainPositions: [],
      loading: true,
      error: null,
    });
    const { result } = renderHook(() => useTrain('ML001A'));
    expect(result.current.loading).toBe(true);
  });

  it('builds trainInfo with correct stations', () => {
    const { result } = renderHook(() => useTrain('ML001A'));
    expect(result.current.trainInfo?.nextStations).toHaveLength(2);
    expect(result.current.trainInfo?.nextStations[0]?.stationName).toBe('São Sebastião');
  });

  it('passes through context error when loading', () => {
    mockUseTrains.mockReturnValue({
      trainData: null,
      trainPositions: [],
      loading: true,
      error: 'Network error',
    });
    const { result } = renderHook(() => useTrain('ML001A'));
    expect(result.current.error).toBe('Network error');
  });
});
