import { Station } from '../types/metro';
import { getStationLines } from './metroUtils';

/**
 * Format time string to display in a user-friendly format
 * @param timeString ISO format time string
 */
export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format time in seconds to minutes and seconds format
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export const formatTimeInSeconds = (seconds: string | number): string => {
  const sec = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;
  
  if (isNaN(sec) || sec <= 0) return 'Chegando';
  
  const min = Math.floor(sec / 60);
  const remainingSec = sec % 60;
  
  if (min === 0) {
    return `${remainingSec}s`;
  }
  
  return `${min}m ${remainingSec}s`;
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Find nearest station to given coordinates
 */
export const findNearestStation = (coordinates: { x: number, y: number }, stations: Station[]): Station | null => {
  if (!stations.length) return null;
  
  let nearestStation = stations[0];
  let shortestDistance = calculateDistance(
    coordinates.x, 
    coordinates.y,
    nearestStation.coordinates.x,
    nearestStation.coordinates.y
  );
  
  for (let i = 1; i < stations.length; i++) {
    const station = stations[i];
    const distance = calculateDistance(
      coordinates.x,
      coordinates.y,
      station.coordinates.x,
      station.coordinates.y
    );
    
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestStation = station;
    }
  }
  
  return nearestStation;
};

/**
 * Get the line name from a destination ID
 * @param destinationId Destination station ID
 * @returns The name of the line for this destination
 */
export const getLineNameFromDestination = (destinationId: string): string => {
  if (!destinationId) return 'Unknown';
  return getStationLines(destinationId)[0] || 'Unknown';
};