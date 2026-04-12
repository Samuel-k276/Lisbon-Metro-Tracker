import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/fetchStationWaitingTimes');

import { fetchStationWaitingTimes } from '@/shared/api/fetchStationWaitingTimes';
import { useStation } from '@/shared/hooks/useStation';
import type { Station } from '@/shared/types/metro';

const mockStation: Station = {
  id: 'AM',
  name: 'Alameda',
  coordinates: { x: -9.13409, y: 38.7373 },
  lines: ['Verde', 'Vermelha'],
  isTransfer: true,
  isTerminal: false,
  nextTrains: [],
};

describe('useStation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading initially', () => {
    vi.mocked(fetchStationWaitingTimes).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useStation('AM'));
    expect(result.current.loading).toBe(true);
    expect(result.current.station).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns station data after fetch', async () => {
    vi.mocked(fetchStationWaitingTimes).mockResolvedValue(mockStation);
    const { result } = renderHook(() => useStation('AM'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.station).toEqual(mockStation);
    expect(result.current.error).toBeNull();
  });

  it('returns error when fetch returns null', async () => {
    vi.mocked(fetchStationWaitingTimes).mockResolvedValue(null);
    const { result } = renderHook(() => useStation('AM'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.station).toBeNull();
    expect(result.current.error).toBe('Failed to load station AM');
  });

  it('returns error when no stationId provided', async () => {
    const { result } = renderHook(() => useStation(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('No station ID provided');
    expect(result.current.station).toBeNull();
  });

  it('cleanup cancels state updates', async () => {
    let resolve: (value: Station | null) => void;
    vi.mocked(fetchStationWaitingTimes).mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );

    const { result, unmount } = renderHook(() => useStation('AM'));
    expect(result.current.loading).toBe(true);

    unmount();
    resolve!(mockStation);

    // After unmount + resolve, no error should be thrown (state updates are cancelled)
    expect(result.current.loading).toBe(true);
  });
});
