import type { LineNames } from '@/shared/data/metroLines';

type Coordinates = {
  x: number;
  y: number;
};

type UserLocation = {
  coordinates: Coordinates;
  accuracy: number;
  timestamp: number;
};

type Line = {
  name: LineNames;
  color: string;
  stations: string[];
  destinations: { [stationName: string]: number };
};

type Station = {
  id: string;
  name: string;
  coordinates: Coordinates;
  lines: LineNames[] | LineNames;
  isTransfer: boolean;
  isTerminal: boolean;
  nextTrains: NextTrainsResponse[];
};

type NextTrainsResponse = {
  destination: string;
  train1: string;
  time1: string;
  train2: string;
  time2: string;
  train3: string;
  time3: string;
};

type Destination = {
  id: string;
  name: string;
};

type LineState = {
  name: LineNames;
  status: string;
  message: string;
};

type StationArrival = [number, [string, string]]; // [arrivalTime, [stationId, destinationId]]

type Train = {
  id: string;
  stationArrivals: StationArrival[];
};

export type {
  Coordinates,
  UserLocation,
  Line,
  Station,
  NextTrainsResponse,
  Destination,
  LineState,
  StationArrival,
  Train,
};
