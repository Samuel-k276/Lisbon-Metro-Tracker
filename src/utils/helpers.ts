import { Line, Station } from '../types/metro';

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
    stations[0].coordinates.x,
    stations[0].coordinates.y
  );
  
  for (let i = 1; i < stations.length; i++) {
    const distance = calculateDistance(
      coordinates.x,
      coordinates.y,
      stations[i].coordinates.x,
      stations[i].coordinates.y
    );
    
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestStation = stations[i];
    }
  }
  
  return nearestStation;
};

/**
 * Sort stations by their position on a line
 */
export const sortStationsByLine = (stations: Station[], line: Line): Station[] => {
  // This is a simplification - in a real app you'd need the actual order from the API
  return stations.sort((a, b) => {
    const aIndex = line.stations.indexOf(a.id);
    const bIndex = line.stations.indexOf(b.id);
    return aIndex - bIndex;
  });
};