import { describe, it, expect } from 'vitest';

import { MetroGraph } from '@/features/planner/graph';

describe('MetroGraph', () => {
  const graph = new MetroGraph();

  describe('getNode', () => {
    it('returns a node for a valid station ID', () => {
      const node = graph.getNode('SS');
      expect(node).toBeDefined();
      expect(node!.id).toBe('SS');
    });

    it('returns undefined for unknown ID', () => {
      expect(graph.getNode('ZZ')).toBeUndefined();
    });
  });

  describe('getNeighbors', () => {
    it('returns neighbors for a valid station', () => {
      const neighbors = graph.getNeighbors('SS');
      expect(neighbors.length).toBeGreaterThan(0);
    });

    it('returns empty array for unknown station', () => {
      expect(graph.getNeighbors('ZZ')).toEqual([]);
    });
  });

  describe('areAdjacent', () => {
    it('returns true for adjacent stations on the same line', () => {
      // Reboleira and Amadora Este are adjacent on Azul
      expect(graph.areAdjacent('RB', 'AS')).toBe(true);
    });

    it('returns false for non-adjacent stations', () => {
      expect(graph.areAdjacent('RB', 'SS')).toBe(false);
    });
  });

  describe('shortestPath', () => {
    it('returns a path between two stations', () => {
      const path = graph.shortestPath('RB', 'SA');
      expect(path.length).toBeGreaterThan(1);
      expect(path[0]).toBe('RB');
      expect(path[path.length - 1]).toBe('SA');
    });

    it('returns direct path for adjacent stations', () => {
      const path = graph.shortestPath('RB', 'AS');
      expect(path).toEqual(['RB', 'AS']);
    });

    it('finds path requiring a line transfer', () => {
      // Reboleira (Azul) to Telheiras (Verde) requires transfer
      const path = graph.shortestPath('RB', 'TE');
      expect(path.length).toBeGreaterThan(2);
      expect(path[0]).toBe('RB');
      expect(path[path.length - 1]).toBe('TE');
    });
  });

  describe('formatPathForUI', () => {
    it('returns empty result for empty path', () => {
      const result = graph.formatPathForUI([]);
      expect(result.segments).toEqual([]);
      expect(result.totalTime).toBe(0);
    });

    it('returns empty result for single station', () => {
      const result = graph.formatPathForUI(['RB']);
      expect(result.segments).toEqual([]);
    });

    it('formats a simple same-line path', () => {
      const path = graph.shortestPath('RB', 'AS');
      const result = graph.formatPathForUI(path);
      expect(result.segments.length).toBe(1);
      expect(result.segments[0]!.type).toBe('travel');
      expect(result.transfers).toBe(0);
    });

    it('includes transfer segments for cross-line paths', () => {
      const path = graph.shortestPath('RB', 'TE');
      const result = graph.formatPathForUI(path);
      expect(result.transfers).toBeGreaterThanOrEqual(1);
      const transfers = result.segments.filter((s) => s.type === 'transfer');
      expect(transfers.length).toBeGreaterThanOrEqual(1);
    });

    it('calculates time correctly', () => {
      const path = graph.shortestPath('RB', 'AS');
      const result = graph.formatPathForUI(path, 2, 4);
      // 2 stations = 1 connection = 2 minutes
      expect(result.totalTime).toBe(2);
    });
  });

  describe('getTransferStations', () => {
    it('returns stations with multiple lines', () => {
      const transfers = graph.getTransferStations();
      expect(transfers.length).toBeGreaterThan(0);
      transfers.forEach((station) => {
        expect(station.lines.length).toBeGreaterThan(1);
      });
    });
  });

  describe('getTerminalStations', () => {
    it('returns stations with only one adjacent station', () => {
      const terminals = graph.getTerminalStations();
      expect(terminals.length).toBeGreaterThan(0);
      terminals.forEach((station) => {
        expect(station.adjacent.length).toBe(1);
      });
    });
  });

  describe('getStationsByLine', () => {
    it('returns stations for a valid line', () => {
      const stations = graph.getStationsByLine('Azul');
      expect(stations.length).toBeGreaterThan(0);
      stations.forEach((station) => {
        expect(station.lines).toContain('Azul');
      });
    });

    it('returns empty for unknown line', () => {
      expect(graph.getStationsByLine('NonExistent')).toEqual([]);
    });
  });
});
