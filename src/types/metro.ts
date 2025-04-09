// Define the types for the Metro Lisboa project

// Coordinates for positioning on the map
export interface Coordinates {
  x: number;
  y: number;
}

// Metro Line
export interface Line {
  id: string;
  name: string; // Line name the same as its color
  stations: string[]; // Array of station IDs
}

// Station
export interface Station {
  id: string;
  name: string;
  coordinates: Coordinates;
  lines: string[]; // Array of line IDs this station belongs to
  isTransfer: boolean; // Whether this is a transfer station
  isTerminal: boolean; // Whether this is a terminal station
  nextTrains: NextTrainsResponse[]; // Next trains information (each index is a different destination)
}

// Train
export interface Train {
  id: string;
  lineId: string;
  currentStationId?: string;
  nextStationId?: string;
  coordinates: Coordinates;
}

// User Location
export interface UserLocation {
  coordinates: Coordinates;
  accuracy: number;
  timestamp: number;
}

// Next Trains response (3 next trains)
export interface NextTrainsResponse {
  destination: string;
  train1: string;
  time1: string;
  train2: string;
  time2: string;
  train3: string;
  time3: string;
}

// Destinations
export interface Destination {
  id: string;
  name: string;
}