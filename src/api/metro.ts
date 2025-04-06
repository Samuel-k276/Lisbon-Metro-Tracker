import { Station, Destination, NextTrainsResponse } from '../types/metro';

// API URL for Lisbon Metro
const API_BASE_URL = 'https://api.metrolisboa.pt:8243/estadoServicoML/1.0.1';

// Because the API uses a self-signed certificate, we need to ignore SSL errors in development
// And maybe in production too, but this is not recommended, the API should be fixed instead
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API_TOKEN = import.meta.env.VITE_API_TOKEN || '031145f2-3e04-3084-a60a-c2955c0d8f0b';

const HEADERS = { 
  'Authorization': `Bearer ${API_TOKEN}`,
  'accept': 'application/json'  
};

// Fetch all metro stations
export const fetchStations = async (): Promise<Station[]> => {
  try {
    console.log(HEADERS);
    const response = await fetch(`${API_BASE_URL}/infoEstacao/todos`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
};

// Fetch all metro destinations (i.e., the last stations of each line)
export const fetchDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/infoDestinos/todos`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch destinations: ${response.status}`);
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
};


// Fetch all waiting times for all lines
export const fetchWaitingTimes = async (): Promise<NextTrainsResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tempoEspera/todos`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch waiting times: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching waiting times:', error);
    return [];
  }
}

// Fetch waiting times for a specific line
export const fetchLineWaitingTimes = async (lineId: string): Promise<NextTrainsResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tempoEspera/Linha/${lineId}`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch waiting times: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching waiting times:', error);
    return [];
  }
};

// Fetch the current line state for all lines
export const fetchLinesState = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/estadoLinha/todos`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch lines state: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching lines state:', error);
    return null;
  }
}