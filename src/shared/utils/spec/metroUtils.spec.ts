import { describe, it, expect } from 'vitest';
import {
  getLineColor,
  getTrainLine,
  getStationNameById,
  isTransferStation,
  isTerminalStation,
  getStationLines,
  getLineStations,
} from '@/shared/utils/metroUtils';

describe('getLineColor', () => {
  it('returns correct color for Azul', () => {
    expect(getLineColor('Azul')).toBe('#0075BF');
  });

  it('returns correct color for Amarela', () => {
    expect(getLineColor('Amarela')).toBe('#FFD800');
  });

  it('returns default color for unknown line', () => {
    expect(getLineColor('NonExistent')).toBe('#888888');
  });
});

describe('getTrainLine', () => {
  it('maps suffix A to Azul', () => {
    expect(getTrainLine('ML001A')).toBe('Azul');
  });

  it('maps suffix B to Amarela', () => {
    expect(getTrainLine('ML002B')).toBe('Amarela');
  });

  it('maps suffix C to Verde', () => {
    expect(getTrainLine('ML003C')).toBe('Verde');
  });

  it('maps suffix D to Vermelha', () => {
    expect(getTrainLine('ML004D')).toBe('Vermelha');
  });

  it('returns Unknown for empty string', () => {
    expect(getTrainLine('')).toBe('Unknown');
  });

  it('returns Unknown for unknown suffix', () => {
    expect(getTrainLine('ML001Z')).toBe('Unknown');
  });
});

describe('getStationNameById', () => {
  it('returns station name for valid ID', () => {
    expect(getStationNameById('SS')).toBe('São Sebastião');
  });

  it('returns default for unknown ID', () => {
    expect(getStationNameById('ZZ')).toBe('Unknown');
  });

  it('returns custom default when provided', () => {
    expect(getStationNameById('ZZ', 'N/A')).toBe('N/A');
  });

  it('returns default for undefined', () => {
    expect(getStationNameById(undefined)).toBe('Unknown');
  });
});

describe('isTransferStation', () => {
  it('returns true for transfer stations', () => {
    // Alameda is on Verde and Vermelha
    expect(isTransferStation('AM')).toBe(true);
  });

  it('returns false for non-transfer stations', () => {
    // Reboleira is only on Azul
    expect(isTransferStation('RB')).toBe(false);
  });

  it('returns false for unknown station', () => {
    expect(isTransferStation('ZZ')).toBe(false);
  });
});

describe('isTerminalStation', () => {
  it('returns true for terminal stations', () => {
    // Reboleira is a terminal on Azul
    expect(isTerminalStation('RB')).toBe(true);
  });

  it('returns false for non-terminal stations', () => {
    expect(isTerminalStation('AM')).toBe(false);
  });
});

describe('getStationLines', () => {
  it('returns lines for a transfer station', () => {
    const lines = getStationLines('AM');
    expect(lines).toContain('Verde');
    expect(lines).toContain('Vermelha');
  });

  it('returns empty array for unknown station', () => {
    expect(getStationLines('ZZ')).toEqual([]);
  });
});

describe('getLineStations', () => {
  it('returns station IDs for a valid line', () => {
    const stations = getLineStations('Azul');
    expect(stations.length).toBeGreaterThan(0);
    expect(stations).toContain('RB'); // Reboleira
  });

  it('returns empty array for unknown line', () => {
    expect(getLineStations('NonExistent')).toEqual([]);
  });
});
