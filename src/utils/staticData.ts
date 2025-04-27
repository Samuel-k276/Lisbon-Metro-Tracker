import { Coordinates, Line } from '../types/metro';
import { LINE_COLORS } from '../constants/metroLines';

// Corrected station coordinates for rendering (x values increased by 130)
export const stationCoordinates: Record<string, Coordinates> = {
  'RB': { x: 69.5, y: 172 },
  'AS': { x: 130, y: 173 },
  'AF': { x: 190, y: 173 },
  'PO': { x: 247, y: 175.5 },
  'CA': { x: 287, y: 210 },
  'CM': { x: 322.5, y: 245 },
  'AH': { x: 358.5, y: 281 },
  'LA': { x: 393.5, y: 316 },
  'JZ': { x: 431.5, y: 354.5 },
  'PE': { x: 479.5, y: 401.5 },
  'PA': { x: 569, y: 490 },
  'MP': { x: 609, y: 527 },
  'AV': { x: 648.5, y: 570 },
  'RE': { x: 695.5, y: 616 },
  'BC': { x: 731.5, y: 651 },
  'TP': { x: 810, y: 689 },
  'SP': { x: 898.5, y: 689.5 }, 
  'OD': { x: 609, y: 10 },
  'SR': { x: 609, y: 55 },
  'AX': { x: 609, y: 100 },
  'LU': { x: 609, y: 146 },
  'QC': { x: 609, y: 190 },
  'CG': { x: 609, y: 236 },
  'CU': { x: 609, y: 298 },
  'EC': { x: 609, y: 358 },
  'CP': { x: 609, y: 403 },
  'SA': { x: 609, y: 450 },
  'PI': { x: 609, y: 491 },
  'RA': { x: 589, y: 582 },
  'TE': { x: 552, y: 236 },
  'AL': { x: 731.5, y: 272 },
  'RM': { x: 731.5, y: 330 },
  'AE': { x: 731.5, y: 371 },
  'AM': { x: 731.5, y: 450 },
  'AR': { x: 731.5, y: 491 },
  'AN': { x: 731.5, y: 524 },
  'IN': { x: 731.5, y: 556 },
  'MM': { x: 731.5, y: 587 },
  'RO': { x: 731.5, y: 619 },
  'CS': { x: 670, y: 690 },
  'AP': { x: 785, y: 172.5 },
  'EN': { x: 853, y: 172.5 },
  'MO': { x: 923, y: 172.5 },
  'OR': { x: 971, y: 240.5 },
  'CR': { x: 943, y: 304 },
  'OS': { x: 911, y: 336 },
  'CH': { x: 875, y: 371 },
  'BV': { x: 844.5, y: 402 },
  'OL': { x: 813, y: 433 },
  'SS': { x: 531, y: 450 }
};

// Updated lines with stations in correct order from one terminal to another
export const lines: Record<string, Line> = {
  // Map metro line names to colors
  'Azul': { 
    name: 'Azul', 
    color: LINE_COLORS.Azul,
    stations: [
     'RB', 'AS', 'AF', 'PO', 'CA', 'CM', 'AH', 'LA', 'JZ', 'PE', 'SS', 'PA', 'MP', 
     'AV', 'RE', 'BC', 'TP', 'SP'
    ],
    destinations: { 'SP': 1, 'RB': -1, 'TP': 1 },
  },
  'Amarela': { 
    name: 'Amarela',
    color: LINE_COLORS.Amarela, 
    stations: [
     'OD', 'SR', 'AX', 'LU', 'QC', 'CG', 'CU', 'EC', 'CP', 'SA', 'PI', 'MP', 'RA'
    ],
    destinations: { 'RA': 1, 'OD': -1, 'CG': -1 },
  },
  'Verde': { 
    name: 'Verde', 
    color: LINE_COLORS.Verde,
    stations: [
     'TE', 'CG', 'AL', 'RM', 'AE', 'AM', 'AR', 'AN', 'IN', 'MM', 'RO', 'BC', 'CS'
    ],
    destinations: { 'CS': 1, 'TE': -1 }
  },
  'Vermelha': { 
    name: 'Vermelha',
    color: LINE_COLORS.Vermelha, 
    stations: [
     'AP', 'EN', 'MO', 'OR', 'CR', 'OS', 'CH', 'BV', 'OL', 'AM', 'SA', 'SS'
    ],
    destinations: { 'SS': 1, 'AP': -1}
  }
};

export const getTrainLine = (trainId: string) => {
  const lastChar = trainId.charAt(trainId.length - 1);
  switch (lastChar) {
    case 'A':
      return 'Azul';
    case 'B':
      return 'Amarela';
    case 'C':
      return 'Verde';
    case 'D':
      return 'Vermelha';
    default:
      return 'Unknown';
  }
};  

export const getLineColor = (line: string) => {
  return lines[line]?.color || '#888888'; // Default color if line not found
}