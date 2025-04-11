import { Station, Destination, NextTrainsResponse, LineState } from '../types/metro';
import { getStationById, getDestinationNameById } from '../utils/stationMappings';

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


export const fetchStationWaitingTimes = async (stationId: string): Promise<Station | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tempoEspera/Estacao/${stationId}`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch station: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.codigo !== "200" || !data.resposta || data.resposta.length === 0) {
      throw new Error('Invalid response format or no data received');
    }
    
    // We need to transform the response to match the Station type
    // Interface for platform data from the API response
    interface PlatformResponse {
      stop_id: string;
      destino: string;
      comboio?: string;
      comboio2?: string;
      comboio3?: string;
      tempoChegada1?: string;
      tempoChegada2?: string;
      tempoChegada3?: string;
    }
    
    // Get the station data from the mappings using the stationId 
    const stationData = getStationById(stationId) || 
      (() => { throw new Error('Station data not found in mappings'); })();

    const station: Station = {
      id: stationId,
      name: stationData?.name,
      coordinates: stationData.coordinates,
      lines: stationData.lines,
      isTransfer: stationData.isTransfer,
      isTerminal: stationData.isTerminal,
      nextTrains: data.resposta.flatMap((platform: PlatformResponse) => {
        // Create separate NextTrainsResponse entries for each valid train
        const trains: NextTrainsResponse = {
          destination: '',
          train1: '',
          time1: '',
          train2: '',
          time2: '',
          train3: '',
          time3: ''
        };
        
        if (platform.comboio && platform.tempoChegada1) {
          trains.destination = getDestinationNameById(platform.destino) || platform.destino;
          if ((stationData?.name === "Alto dos Moinhos" || stationData?.name === "Amadora Este")
              && trains.destination === "Terreiro do Paço") {
            trains.destination = "Santa Apolónia";
          }
          trains.train1 = platform.comboio;
          trains.time1 = platform.tempoChegada1;
        }
        
        if (platform.comboio2 && platform.tempoChegada2) {
          trains.train2 = platform.comboio2;
          trains.time2 = platform.tempoChegada2;
        }
        
        if (platform.comboio3 && platform.tempoChegada3) {
          trains.train3 = platform.comboio3;
          trains.time3 = platform.tempoChegada3;
        }
        
        return trains;
      })
    };
    
    // If is a Terminal Station remove duplicated destinations and the destination that is the same as the station name
    if (station.isTerminal) {
      const processedDestinations = new Set<string>();
      station.nextTrains = station.nextTrains.filter(train => {
        // Skip trains with destination same as station name
        if (train.destination === station.name) return false;
        
        // Check if we've already processed this destination
        if (processedDestinations.has(train.destination)) return false;
        
        // Add to processed set and keep this train
        processedDestinations.add(train.destination);
        return true;
      });
    }

    return station;
  }
  catch (error) {
    console.error('Error fetching station:', error);
    return null;
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

export const fetchStations = async (): Promise<Station[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/infoEstacao/todos`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status}`);
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
}

export const fetchLineStateAll = async (): Promise<LineState[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/estadoLinha/todos`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch line state: ${response.status}`);
    }

    const data = await response.json();
    if (data.codigo !== "200" || !data.resposta || data.resposta.length === 0) {
      throw new Error('Invalid response format or no data received, code: ' + data.codigo);
    }
    // Transform the response to match the LineState type
    const lineStates: LineState[] = [
      {
        name: "Amarela",
        status: data.resposta.amarela.trim(),
        message: data.resposta.tipo_msg_am
      },
      {
        name: "Azul",
        status: data.resposta.azul.trim(),
        message: data.resposta.tipo_msg_az
      },
      {
        name: "Verde",
        status: data.resposta.verde.trim(),
        message: data.resposta.tipo_msg_vd
      },
      {
        name: "Vermelha",
        status: data.resposta.vermelha.trim(),
        message: data.resposta.tipo_msg_vm
      }
    ];

    return lineStates;

  } catch (error) {
    console.error('Error fetching line state:', error);
    return [];
  }
}