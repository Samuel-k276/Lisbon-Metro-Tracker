import { Coordinates, Line } from '../types/metro';


// Corrected station coordinates for rendering (normalized to fit within 1000x800 canvas)
export const stationCoordinates: Record<string, Coordinates> = {
  'RB': { x: 18, y: 200 },
  'AS': { x: 77, y: 200 },
  'AF': { x: 137, y: 200 },
  'PO': { x: 198, y: 208 },
  'CA': { x: 233, y: 243 },
  'CM': { x: 268, y: 278 },
  'AH': { x: 303, y: 313 },
  'LA': { x: 338, y: 348 },
  'JZ': { x: 373, y: 383 },
  'PE': { x: 424, y: 434 },
  'PA': { x: 514, y: 524 },
  'MP': { x: 553, y: 563 },
  'AV': { x: 594, y: 604 },
  'RE': { x: 639, y: 649 },
  'BC': { x: 676, y: 686 },
  'TP': { x: 754, y: 722 },
  'SP': { x: 842, y: 722 },
  'OD': { x: 553, y: 50 },
  'SR': { x: 553, y: 100 },
  'AX': { x: 553, y: 150 },
  'LU': { x: 553, y: 200 },
  'QC': { x: 553, y: 250 },
  'CG': { x: 553, y: 300 },
  'CU': { x: 553, y: 350 },
  'EC': { x: 553, y: 395 },
  'CP': { x: 553, y: 440 },
  'SA': { x: 553, y: 484 },
  'PI': { x: 553, y: 524 },
  'RA': { x: 535, y: 615 },
  'TE': { x: 497, y: 300 },
  'AL': { x: 676, y: 303 },
  'RM': { x: 676, y: 362 },
  'AE': { x: 676, y: 404 },
  'AM': { x: 676, y: 484 },
  'AR': { x: 676, y: 524 },
  'AN': { x: 676, y: 557 },
  'IN': { x: 676, y: 589 },
  'MM': { x: 676, y: 620 },
  'RO': { x: 676, y: 651 },
  'CS': { x: 604, y: 722 },
  'AP': { x: 729, y: 204 },
  'EN': { x: 796, y: 204 },
  'MO': { x: 863, y: 204 },
  'OR': { x: 913, y: 273 },
  'CR': { x: 885, y: 337 },
  'OS': { x: 853, y: 368 },
  'CH': { x: 818, y: 402 },
  'BV': { x: 786, y: 434 },
  'OL': { x: 755, y: 465 },
  'SS': { x: 474, y: 484 }
};

// Updated lines with stations in correct order from one terminal to another
export const lines: Record<string, Line> = {
   // Map metro line names to colors
   'Azul': { 
     name: 'Azul', 
     color: '#0075BF',
     stations: [
       'RB', 'AS', 'AF', 'PO', 'CA', 'CM', 'AH', 'LA', 'JZ', 'PE', 'PA', 'MP', 
       'AV', 'RE', 'BC', 'TP', 'SP'
     ]
   },
   'Amarela': { 
     name: 'Amarela',
     color: '#FFD800', 
     stations: [
       'OD', 'SR', 'AX', 'LU', 'QC', 'CG', 'CU', 'EC', 'CP', 'SA', 'PI', 'MP', 'RA'
     ]
   },
   'Verde': { 
     name: 'Verde', 
     color: '#00A9A6',
     stations: [
       'TE', 'CG', 'AL', 'RM', 'AE', 'AM', 'AR', 'AN', 'IN', 'MM', 'RO', 'BC', 'CS'
     ]
   },
   'Vermelha': { 
     name: 'Vermelha',
     color: '#ED1C24', 
     stations: [
       'AP', 'EN', 'MO', 'OR', 'CR', 'OS', 'CH', 'BV', 'OL', 'AM', 'SA', 'SS'
     ]
   }
};