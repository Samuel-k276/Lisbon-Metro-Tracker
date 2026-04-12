import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/contexts/TrainContext');

import { useTrains } from '@/shared/contexts/TrainContext';
import { useStation } from '@/shared/hooks/useStation';

const mockUseTrains = vi.mocked(useTrains);

describe('useStation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTrains.mockReturnValue({
      trainData: {},
      trainPositions: [],
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    });
  });

  it('returns station data for valid ID', () => {
    const { result } = renderHook(() => useStation('AM'));
    expect(result.current.station).not.toBeNull();
    expect(result.current.station?.name).toBe('Alameda');
    expect(result.current.loading).toBe(false);
  });

  it('returns null for unknown station ID', () => {
    const { result } = renderHook(() => useStation('ZZ'));
    expect(result.current.station).toBeNull();
    expect(result.current.error).toBe('Estação não encontrada');
  });

  it('returns null for undefined ID', () => {
    const { result } = renderHook(() => useStation(undefined));
    expect(result.current.station).toBeNull();
  });

  it('passes through loading state', () => {
    mockUseTrains.mockReturnValue({
      trainData: null,
      trainPositions: [],
      loading: true,
      error: null,
      lastUpdated: null,
    });
    const { result } = renderHook(() => useStation('AM'));
    expect(result.current.loading).toBe(true);
  });

  it('builds nextTrains from train data', () => {
    mockUseTrains.mockReturnValue({
      trainData: {
        T1A: {
          id: 'T1A',
          stationArrivals: [
            [60, ['AM', '1']],
            [180, ['SS', '1']],
          ],
        },
        T2A: {
          id: 'T2A',
          stationArrivals: [[120, ['AM', '1']]],
        },
      },
      trainPositions: [],
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    });

    const { result } = renderHook(() => useStation('AM'));
    expect(result.current.station?.nextTrains).toHaveLength(1);
    expect(result.current.station?.nextTrains[0]?.train1).toBe('T1A');
    expect(result.current.station?.nextTrains[0]?.time1).toBe('60');
    expect(result.current.station?.nextTrains[0]?.train2).toBe('T2A');
    expect(result.current.station?.nextTrains[0]?.time2).toBe('120');
  });
});
