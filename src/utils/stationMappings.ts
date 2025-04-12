// Station mappings and related utilities
// This file provides mappings between station IDs and names
// and utility functions to translate IDs to human-readable names

import { Coordinates } from "../types/metro"; // Adjust the import path as necessary

// Type for our station mapping
export interface StationMapping {
  id: string;
  name: string;
  coordinates: Coordinates;
  lines: string[]; // Array of line IDs this station belongs to
  isTransfer: boolean; // Whether this is a transfer station
  isTerminal: boolean; // Whether this is a terminal station
}

// Dictionary of destination IDs to names
export const DestinationMapping: Record<string, string> = {
  "1": "Reboleira",
  "18": "Santa Apolónia",
  "33": "Reboleira",
  "34": "Amadora Este",
  "35": "Pontinha",
  "36": "Colégio Militar/Luz",
  "37": "Laranjeiras",
  "38": "São Sebastião",
  "39": "Avenida",
  "40": "Baixa-Chiado",
  "41": "Terreiro do Paço",
  "42": "Santa Apolónia",
  "43": "Odivelas",
  "44": "Lumiar",
  "45": "Campo Grande",
  "46": "Campo Pequeno",
  "48": "Rato",
  "50": "Telheiras",
  "51": "Alvalade",
  "52": "Alameda",
  "53": "Martim Moniz",
  "54": "Cais do Sodré",
  "56": "Bela Vista",
  "57": "Chelas",
  "59": "Moscavide",
  "60": "Aeroporto",
};


// Dictionary of station IDs to names
// Ìt's defined statically because the data is not expected to change frequently
// and it allows for better performance and easier maintenance
// as we don't need to fetch it from an external source every time
export const stationMappings: Record<string, StationMapping> = {
  // Lisbon Metro stations with their data
  "AM": { id: "AM", name: "Alameda", coordinates: { x: -9.13409, y: 38.7373 }, lines: ["Verde", "Vermelha"], isTransfer: true, isTerminal: false },
  "AF": { id: "AF", name: "Alfornelos", coordinates: { x: -9.20471, y: 38.7606 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "AH": { id: "AH", name: "Alto dos Moinhos", coordinates: { x: -9.17995, y: 38.7496 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "AL": { id: "AL", name: "Alvalade", coordinates: { x: -9.14388, y: 38.7535 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "AS": { id: "AS", name: "Amadora Este", coordinates: { x: -9.21917, y: 38.7584 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "AX": { id: "AX", name: "Ameixoeira", coordinates: { x: -9.15999, y: 38.7799 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "AN": { id: "AN", name: "Anjos", coordinates: { x: -9.13503, y: 38.7266 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "AE": { id: "AE", name: "Areeiro", coordinates: { x: -9.13381, y: 38.7426 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "AR": { id: "AR", name: "Arroios", coordinates: { x: -9.13445, y: 38.7335 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "AV": { id: "AV", name: "Avenida", coordinates: { x: -9.14582, y: 38.7201 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "BC": { id: "BC", name: "Baixa/Chiado", coordinates: { x: -9.13909, y: 38.7107 }, lines: ["Azul", "Verde"], isTransfer: true, isTerminal: false },
  "BV": { id: "BV", name: "Bela Vista", coordinates: { x: -9.11855, y: 38.7477 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "CR": { id: "CR", name: "Cabo Ruivo", coordinates: { x: -9.10409, y: 38.7632 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "CS": { id: "CS", name: "Cais do Sodré", coordinates: { x: -9.14503, y: 38.7062 }, lines: ["Verde"], isTransfer: false, isTerminal: true },
  "CG": { id: "CG", name: "Campo Grande", coordinates: { x: -9.15794, y: 38.7599 }, lines: ["Amarela", "Verde"], isTransfer: true, isTerminal: false },
  "CP": { id: "CP", name: "Campo Pequeno", coordinates: { x: -9.14703, y: 38.7414 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "CA": { id: "CA", name: "Carnide", coordinates: { x: -9.19281, y: 38.7593 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "CH": { id: "CH", name: "Chelas", coordinates: { x: -9.11414, y: 38.7553 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "CU": { id: "CU", name: "Cidade Universitária", coordinates: { x: -9.15863, y: 38.7519 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "CM": { id: "CM", name: "Colégio Militar/Luz", coordinates: { x: -9.18866, y: 38.7533 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "EC": { id: "EC", name: "Entre Campos", coordinates: { x: -9.14856, y: 38.7479 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "IN": { id: "IN", name: "Intendente", coordinates: { x: -9.13531, y: 38.7222 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "JZ": { id: "JZ", name: "Jardim Zoológico", coordinates: { x: -9.16872, y: 38.7422 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "LA": { id: "LA", name: "Laranjeiras", coordinates: { x: -9.17243, y: 38.7485 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "LU": { id: "LU", name: "Lumiar", coordinates: { x: -9.1597, y: 38.7728 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "MP": { id: "MP", name: "Marquês de Pombal", coordinates: { x: -9.15081, y: 38.7249 }, lines: ["Amarela", "Azul"], isTransfer: true, isTerminal: false },
  "MM": { id: "MM", name: "Martim Moniz", coordinates: { x: -9.13575, y: 38.7168 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "OD": { id: "OD", name: "Odivelas", coordinates: { x: -9.17322, y: 38.7932 }, lines: ["Amarela"], isTransfer: false, isTerminal: true },
  "OL": { id: "OL", name: "Olaias", coordinates: { x: -9.12366, y: 38.7392 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "OS": { id: "OS", name: "Olivais", coordinates: { x: -9.11204, y: 38.7613 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "OR": { id: "OR", name: "Oriente", coordinates: { x: -9.09977, y: 38.7678 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "PA": { id: "PA", name: "Parque", coordinates: { x: -9.15028, y: 38.7297 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "PI": { id: "PI", name: "Picoas", coordinates: { x: -9.1465, y: 38.7306 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "PO": { id: "PO", name: "Pontinha", coordinates: { x: -9.19693, y: 38.7624 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "PE": { id: "PE", name: "Praça de Espanha", coordinates: { x: -9.15845, y: 38.7377 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "QC": { id: "QC", name: "Quinta das Conchas", coordinates: { x: -9.15546, y: 38.7671 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "RA": { id: "RA", name: "Rato", coordinates: { x: -9.15411, y: 38.7201 }, lines: ["Amarela"], isTransfer: false, isTerminal: true },
  "RE": { id: "RE", name: "Restauradores", coordinates: { x: -9.14162, y: 38.7151 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "RM": { id: "RM", name: "Roma", coordinates: { x: -9.14135, y: 38.7485 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "RO": { id: "RO", name: "Rossio", coordinates: { x: -9.13896, y: 38.7138 }, lines: ["Verde"], isTransfer: false, isTerminal: false },
  "SA": { id: "SA", name: "Saldanha", coordinates: { x: -9.14558, y: 38.7353 }, lines: ["Amarela", "Vermelha"], isTransfer: true, isTerminal: false },
  "SP": { id: "SP", name: "Santa Apolónia", coordinates: { x: -9.12256, y: 38.7138 }, lines: ["Azul"], isTransfer: false, isTerminal: true },
  "SS": { id: "SS", name: "São Sebastião", coordinates: { x: -9.15423, y: 38.7348 }, lines: ["Azul", "Vermelha"], isTransfer: true, isTerminal: true },
  "SR": { id: "SR", name: "Senhor Roubado", coordinates: { x: -9.17215, y: 38.7858 }, lines: ["Amarela"], isTransfer: false, isTerminal: false },
  "TE": { id: "TE", name: "Telheiras", coordinates: { x: -9.16606, y: 38.7604 }, lines: ["Verde"], isTransfer: false, isTerminal: true },
  "TP": { id: "TP", name: "Terreiro do Paço", coordinates: { x: -9.13335, y: 38.7072 }, lines: ["Azul"], isTransfer: false, isTerminal: false },
  "MO": { id: "MO", name: "Moscavide", coordinates: { x: -9.10266, y: 38.7748 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "EN": { id: "EN", name: "Encarnação", coordinates: { x: -9.11498, y: 38.775 }, lines: ["Vermelha"], isTransfer: false, isTerminal: false },
  "AP": { id: "AP", name: "Aeroporto", coordinates: { x: -9.12833, y: 38.7686 }, lines: ["Vermelha"], isTransfer: false, isTerminal: true },
  "RB": { id: "RB", name: "Reboleira", coordinates: { x: -9.22414, y: 38.7522 }, lines: ["Azul"], isTransfer: false, isTerminal: true }
};

/**
 * Get station name from station ID
 * @param id Station ID
 * @returns Station name or the ID if not found
 */
export const getStationNameById = (id: string): string => {
  return stationMappings[id]?.name || id;
};

/**
 * Get station by ID
 * @param id Station ID
 * @returns Station mapping object or undefined if not found
 */
export const getStationById = (id: string): StationMapping | undefined => {
  return stationMappings[id];
};

/**
 * Get the destination station name by station ID
 * @param id Station ID
 * @returns Destination name or the ID if not found
 */
export const getDestinationNameById = (id: string, stationId: string): string => {
  if ((stationId === "AS" || stationId === "AH") && DestinationMapping[id] == "Terreiro do Paço") {
    return "Santa Apolónia";
  } 
  
  if ((stationId === "CP" || stationId === "SA" || stationId === "PI" || stationId === "MP") && DestinationMapping[id] == "Campo Grande") {
    return "Odivelas";
  }

  return DestinationMapping[id] || id;
}