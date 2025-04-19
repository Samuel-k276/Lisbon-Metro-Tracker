// Define the types for the Metro Lisboa project
import { OrderedMap  } from "js-sdsl";

// Coordinates for positioning on the map
export interface Coordinates {
  x: number;
  y: number;
}


// User Location
export interface UserLocation {
  coordinates: Coordinates;
  accuracy: number;
  timestamp: number;
}


// Metro Line
export interface Line {
  name: string;
  color: string; // Color for the line (e.g. '#00A9A6', '#FFD800')
  stations: string[]; // Array of station IDs
  destinations: { [stationName: string]: number }; // Maps terminal stations to their directions
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

// Metro's lines state 
export interface LineState {
  name: 'Amarela' | 'Azul' | 'Verde' | 'Vermelha';
  status: string;
  message: string;
}

// Train information
export interface Train {
  id: string;
  destination: string; // So we can know where the train is going
  // TreeMap de tempos de chegada para IDs de estação
  // As chaves (tempos de chegada em segundos) são automaticamente mantidas em ordem crescente
  stationArrivals: OrderedMap <number, string>;
}
