import { OrderedMap } from "js-sdsl";
import type { LineNames } from "@/shared/data/metroLines";

export type Coordinates = {
  x: number;
  y: number;
};

export type UserLocation = {
  coordinates: Coordinates;
  accuracy: number;
  timestamp: number;
};

export type Line = {
  name: LineNames;
  color: string;
  stations: string[];
  destinations: { [stationName: string]: number };
};

export type Station = {
  id: string;
  name: string;
  coordinates: Coordinates;
  lines: LineNames[] | LineNames;
  isTransfer: boolean;
  isTerminal: boolean;
  nextTrains: NextTrainsResponse[];
};

export type NextTrainsResponse = {
  destination: string;
  train1: string;
  time1: string;
  train2: string;
  time2: string;
  train3: string;
  time3: string;
};

export type Destination = {
  id: string;
  name: string;
};

export type LineState = {
  name: LineNames;
  status: string;
  message: string;
};

export type Train = {
  id: string;
  stationArrivals: OrderedMap<number, [string, string]>;
};
