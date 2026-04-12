import type { LineNames } from '@/shared/data/metroLines';
import { lines } from '@/shared/data/staticData';
import { stationMappings } from '@/shared/data/stationMappings';

type GraphNode = {
  id: string;
  lines: string[];
  adjacent: string[];
};

type PathSegment = {
  type: 'travel' | 'transfer';
  from: string;
  to: string;
  line?: string;
  time: number;
  stations: number;
};

type FormattedPath = {
  segments: PathSegment[];
  transfers: number;
  totalTime: number;
  stations: number;
};

class MetroGraph {
  private nodes: Map<string, GraphNode>;

  constructor() {
    this.nodes = new Map();
    this.buildGraph();
  }

  private buildGraph(): void {
    for (const [id, station] of Object.entries(stationMappings)) {
      this.nodes.set(id, {
        id,
        lines: Array.isArray(station.lines) ? station.lines : [station.lines],
        adjacent: [],
      });
    }

    for (const lineName of Object.keys(lines) as LineNames[]) {
      const lineData = lines[lineName];
      if (!lineData) continue;
      const stations = lineData.stations;

      for (let i = 0; i < stations.length - 1; i++) {
        const current = stations[i];
        const next = stations[i + 1];
        if (!current || !next) continue;

        this.addEdge(current, next);
        this.addEdge(next, current);
      }
    }
  }

  private addEdge(from: string, to: string): void {
    const node = this.nodes.get(from);
    if (node && !node.adjacent.includes(to)) {
      node.adjacent.push(to);
    }
  }

  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getNeighbors(id: string): GraphNode[] {
    const node = this.nodes.get(id);
    if (!node) return [];

    return node.adjacent
      .map((adjId) => this.nodes.get(adjId))
      .filter((node): node is GraphNode => node !== undefined);
  }

  areAdjacent(id1: string, id2: string): boolean {
    const node = this.nodes.get(id1);
    return node ? node.adjacent.includes(id2) : false;
  }

  /**
   * Finds the shortest path between two stations using a modified Dijkstra's algorithm
   * that penalizes line transfers with additional cost.
   */
  shortestPath(fromId: string, toId: string): string[] {
    const distances = new Map<string, [number, string[]]>();
    const previous = new Map<string, string[] | null>();
    const visited = new Set<string>();
    const queue: Array<[number, string]> = [];

    for (const node of this.nodes.values()) {
      distances.set(node.id, [Infinity, ['']]);
      previous.set(node.id, null);
    }

    distances.set(fromId, [0, this.nodes.get(fromId)!.lines]);
    queue.push([0, fromId]);

    while (queue.length > 0) {
      queue.sort((a, b) => b[0] - a[0]);
      const [currentDistance, currentId] = queue.pop()!;
      const currentNode = this.nodes.get(currentId);

      if (!currentNode || visited.has(currentId)) continue;
      visited.add(currentId);

      if (currentId === toId) {
        break;
      }

      for (const neighbor of currentNode.adjacent) {
        const commonLine = this.nodes
          .get(neighbor)!
          .lines.filter((line) => distances.get(currentId)![1].includes(line));
        const weight = commonLine.length > 0 ? 1 : 3;
        const newDistance = currentDistance + weight;
        if (newDistance < distances.get(neighbor)![0]) {
          distances.set(neighbor, [newDistance, commonLine]);
          previous.set(neighbor, [currentId]);
          queue.push([newDistance, neighbor]);
        } else if (newDistance === distances.get(neighbor)![0]) {
          const existingLines = distances.get(neighbor)![1];
          const newLines = [
            ...existingLines,
            ...commonLine.filter((line) => !existingLines.includes(line)),
          ];
          distances.set(neighbor, [newDistance, newLines]);
          previous.set(neighbor, [...previous.get(neighbor)!, currentId]);
        }
      }
    }

    const path: string[] = [];
    let currentNodeId = toId;

    while (currentNodeId !== fromId) {
      const prev = previous.get(currentNodeId)!;
      path.unshift(currentNodeId);
      currentNodeId = prev[0]!;
    }

    path.unshift(fromId);

    return path;
  }

  formatPathForUI(
    path: string[],
    minutesPerStation: number = 2,
    minutesPerTransfer: number = 4,
  ): FormattedPath {
    if (!path || path.length === 0) {
      return { segments: [], transfers: 0, totalTime: 0, stations: 0 };
    }

    if (path.length === 1) {
      return {
        segments: [],
        transfers: 0,
        totalTime: 0,
        stations: 0,
      };
    }

    return this.processPathManually(path, minutesPerStation, minutesPerTransfer);
  }

  private processPathManually(
    path: string[],
    minutesPerStation: number,
    minutesPerTransfer: number,
  ): FormattedPath {
    const segments: PathSegment[] = [];
    let transfers = 0;

    let currentLine = '';
    let segmentStartIndex = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const currentId = path[i]!;
      const nextId = path[i + 1]!;

      const currentNode = this.nodes.get(currentId)!;
      const nextNode = this.nodes.get(nextId)!;

      const commonLines = currentNode.lines.filter((line) => nextNode.lines.includes(line));
      const lineBetweenStations = commonLines.length > 0 ? commonLines[0]! : '';

      if (i === 0 || lineBetweenStations !== currentLine) {
        if (i > 0) {
          const segmentStart = this.nodes.get(path[segmentStartIndex]!)!;
          const segmentEnd = this.nodes.get(path[i]!)!;
          const stationCount = i - segmentStartIndex + 1;

          const startName = stationMappings[segmentStart.id]?.name || segmentStart.id;
          const endName = stationMappings[segmentEnd.id]?.name || segmentEnd.id;

          segments.push({
            type: 'travel',
            from: startName,
            to: endName,
            line: currentLine,
            time: (stationCount - 1) * minutesPerStation,
            stations: stationCount,
          });

          if (lineBetweenStations !== currentLine) {
            transfers++;
            segments.push({
              type: 'transfer',
              from: currentLine,
              to: lineBetweenStations,
              time: minutesPerTransfer,
              stations: 0,
            });
          }

          segmentStartIndex = i;
        }

        currentLine = lineBetweenStations;
      }

      if (i === path.length - 2) {
        const segmentStart = this.nodes.get(path[segmentStartIndex]!)!;
        const segmentEnd = this.nodes.get(nextId!)!;
        const stationCount = i + 1 - segmentStartIndex + 1;

        const startName = stationMappings[segmentStart.id]?.name || segmentStart.id;
        const endName = stationMappings[segmentEnd.id]?.name || segmentEnd.id;

        segments.push({
          type: 'travel',
          from: startName,
          to: endName,
          line: currentLine,
          time: (stationCount - 1) * minutesPerStation,
          stations: stationCount,
        });
      }
    }

    const totalTime = segments.reduce((total, segment) => total + segment.time, 0);
    const stations =
      segments
        .filter((segment) => segment.type === 'travel')
        .reduce((total, segment) => total + segment.stations, 0) - transfers;

    return {
      segments,
      transfers,
      totalTime,
      stations,
    };
  }

  getTransferStations(): GraphNode[] {
    return Array.from(this.nodes.values()).filter((node) => node.lines.length > 1);
  }

  getStationsByLine(lineName: string): GraphNode[] {
    return Array.from(this.nodes.values()).filter((node) => node.lines.includes(lineName));
  }

  getTerminalStations(): GraphNode[] {
    return Array.from(this.nodes.values()).filter((node) => node.adjacent.length === 1);
  }
}

const metroGraph = new MetroGraph();

export { MetroGraph, metroGraph };
export type { GraphNode, PathSegment, FormattedPath };
