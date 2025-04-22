import { Station, NextTrainsResponse, LineState, Train } from '../types/metro';
import { getStationById, getDestinationNameById, getDestinationId } from '../utils/stationMappings';
import { TrainArrival } from './responseTypes';
import { OrderedMap } from 'js-sdsl';

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
          trains.destination = getDestinationNameById(platform.destino, stationId);
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

// Fetch all waiting times for all lines
export const fetchTrainData = async (): Promise<Record<string, Train>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tempoEspera/Estacao/todos`, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch waiting times: ${response.status}`);
    }


    const data = await response.json();
    if (data.codigo !== "200" || !data.resposta || data.resposta.length === 0) {
      throw new Error('Invalid response format or no data received');
    }

    // This will be our returned object
    const trains: Record<string, Train> = {};

    // Use the response to store the train data in ../utils/staticData.ts/trains
    for (const response of data.resposta) {
      const trainArrival: TrainArrival = response as TrainArrival;
      
      // Process all three potential trains in a cleaner way
      const trainData = [
        { id: trainArrival.comboio, time: trainArrival.tempoChegada1 },
        { id: trainArrival.comboio2, time: trainArrival.tempoChegada2 },
        { id: trainArrival.comboio3, time: trainArrival.tempoChegada3 }
      ];
      
      for (const train of trainData) {
        if (train.id && train.time) {
          if (!trains[train.id]) {
            if (train.id === "009A") {
              console.log(trainArrival.destino);
            }
            // Create new train with a stationArrivals Map
            trains[train.id] = {
              id: train.id,
              stationArrivals: new OrderedMap<number, [string, string]>([
                [parseInt(train.time), [trainArrival.stop_id.toString(), getDestinationId(trainArrival.destino)]] as [number, [string, string]]
              ])
            };
          } else {
            // Add the station arrival to the existing train's Map
            trains[train.id].stationArrivals.setElement(parseInt(train.time), [trainArrival.stop_id.toString(), getDestinationId(trainArrival.destino)]);
            // The Map will automatically sort entries by key (arrivalTime)
          }
        }
      }
    }

    console.log('Train data fetched and stored successfully.');
    console.log(trains);

    return trains;
  } catch (error) {
    console.error('Error fetching waiting times:', error);
    return {};
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
      status: data.resposta.amarela.trim().replace(/^\w/, (c: string) => c.toUpperCase()),
      message: data.resposta.tipo_msg_am
      },
      {
      name: "Azul",
      status: data.resposta.azul.trim().replace(/^\w/, (c: string) => c.toUpperCase()),
      message: data.resposta.tipo_msg_az
      },
      {
      name: "Verde",
      status: data.resposta.verde.trim().replace(/^\w/, (c: string) => c.toUpperCase()),
      message: data.resposta.tipo_msg_vd
      },
      {
      name: "Vermelha",
      status: data.resposta.vermelha.trim().replace(/^\w/, (c: string) => c.toUpperCase()),
      message: data.resposta.tipo_msg_vm
      }
    ];

    return lineStates;

  } catch (error) {
    console.error('Error fetching line state:', error);
    return [];
  }
}