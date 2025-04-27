import { LINE_COLORS, LineNames, TRAIN_LINE_MAPPING } from "../constants/metroLines";
import { lines } from "./staticData";
import { stationMappings } from "./stationMappings";

/**
 * Get the color associated with a metro line
 * @param lineName The name of the metro line
 * @returns The color hex code for the line or a default color if not found
 */
export const getLineColor = (lineName: string): string => {
  return LINE_COLORS[lineName as LineNames] || '#888888';
};

/**
 * Determine which metro line a train belongs to based on its ID
 * @param trainId The train identifier
 * @returns The name of the metro line the train operates on
 */
export const getTrainLine = (trainId: string): LineNames | 'Unknown' => {
  if (!trainId || trainId.length === 0) return 'Unknown';
  const lastChar = trainId.charAt(trainId.length - 1);
  return TRAIN_LINE_MAPPING[lastChar] || 'Unknown';
};

/**
 * Get station name by ID
 * @param stationId The station identifier
 * @param defaultName Optional default value if station not found
 * @returns The name of the station or default value if not found
 */
export const getStationNameById = (stationId?: string, defaultName: string = 'Unknown'): string => {
  if (!stationId) return defaultName;
  return stationMappings[stationId]?.name || defaultName;
};

/**
 * Check if a station is a transfer station (has multiple lines)
 * @param stationId The station identifier
 * @returns Boolean indicating if station is a transfer station
 */
export const isTransferStation = (stationId: string): boolean => {
  const station = stationMappings[stationId];
  if (!station) return false;
  return Array.isArray(station.lines) ? station.lines.length > 1 : false;
};

/**
 * Check if a station is a terminal station (end of line)
 * @param stationId The station identifier
 * @returns Boolean indicating if station is a terminal station
 */
export const isTerminalStation = (stationId: string): boolean => {
  const station = stationMappings[stationId];
  if (!station) return false;
  return station.isTerminal;
};

/**
 * Get all lines that pass through a specific station
 * @param stationId The station identifier
 * @returns Array of line names for the station
 */
export const getStationLines = (stationId: string): string[] => {
  const station = stationMappings[stationId];
  if (!station) return [];
  return Array.isArray(station.lines) ? station.lines : [station.lines];
};

/**
 * Get all stations for a specific line
 * @param lineName The name of the metro line
 * @returns Array of station IDs that belong to the line
 */
export const getLineStations = (lineName: string): string[] => {
  return lines[lineName]?.stations || [];
};