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

/**
 * Passes the time in seconds to a string in mm:ss format
 * @param seconds Time in seconds
 * @return Formatted time string
 */
export const formatTimeInSeconds = (seconds: string): string => {
  const totalSeconds = parseInt(seconds, 10);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Get line name from destination name
 * @param destinationName Destination name
 */
export const getLineNameFromDestination = (destinationName: string): string => {
  // Map stations directly to their line names
  const stationToLineMap: Record<string, string> = {
    // Linha Amarela (Yellow Line)
    'Odivelas': 'Amarela',
    'Senhora da Rocha': 'Amarela',
    'Ameixoeira': 'Amarela',
    'Lumiar': 'Amarela',
    'Quinta das Conchas': 'Amarela',
    'Campo Grande': 'Amarela', // Note: Campo Grande is also on Verde (Green Line)
    'Cidade Universitária': 'Amarela',
    'Entrecampos': 'Amarela',
    'Campo Pequeno': 'Amarela',
    'Saldanha': 'Amarela', // Note: Saldanha is also on Vermelha (Red Line)
    'Picoas': 'Amarela',
    'Marquês de Pombal': 'Amarela', // Note: Marquês is also on Azul (Blue Line)
    'Rato': 'Amarela',
    
    // Linha Azul (Blue Line)
    'Reboleira': 'Azul',
    'Amadora Este': 'Azul',
    'Alfornelos': 'Azul',
    'Pontinha': 'Azul',
    'Carnide': 'Azul',
    'Colégio Militar/Luz': 'Azul',
    'Alto dos Moinhos': 'Azul',
    'Laranjeiras': 'Azul',
    'Jardim Zoológico': 'Azul',
    'Praça de Espanha': 'Azul',
    //'São Sebastião': 'Vermelha',  Note: São Sebastião is already on Vermelha (Red Line)
    'Parque': 'Azul',
    // 'Marquês de Pombal': 'Azul', // Already defined above
    'Avenida': 'Azul',
    'Restauradores': 'Azul',
    'Baixa-Chiado': 'Azul', // Note: Baixa-Chiado is also on Verde (Green Line)
    'Terreiro do Paço': 'Azul',
    'Santa Apolónia': 'Azul',
    
    // Linha Verde (Green Line)
    'Telheiras': 'Verde',
    // 'Campo Grande': 'Verde', // Already defined above
    'Alvalade': 'Verde',
    'Roma': 'Verde',
    'Areeiro': 'Verde',
    'Alameda': 'Verde', // Note: Alameda is also on Vermelha (Red Line)
    'Arroios': 'Verde',
    'Anjos': 'Verde',
    'Intendente': 'Verde',
    'Martim Moniz': 'Verde',
    'Rossio': 'Verde',
    // 'Baixa-Chiado': 'Verde', // Already defined above
    'Cais do Sodré': 'Verde',
    
    // Linha Vermelha (Red Line)
    'São Sebastião': 'Vermelha',
    // 'Saldanha': 'Vermelha', // Already defined above
    // 'Alameda': 'Vermelha', // Already defined above
    'Olaias': 'Vermelha',
    'Bela Vista': 'Vermelha',
    'Chelas': 'Vermelha',
    'Olivais': 'Vermelha',
    'Cabo Ruivo': 'Vermelha',
    'Oriente': 'Vermelha',
    'Moscavide': 'Vermelha',
    'Encarnação': 'Vermelha',
    'Aeroporto': 'Vermelha'
  };

  return stationToLineMap[destinationName] || '';
};