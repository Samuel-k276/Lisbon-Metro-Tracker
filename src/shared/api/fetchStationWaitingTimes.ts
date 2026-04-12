import { apiFetch } from '@/shared/api/client';
import { getStationById, getDestinationNameById } from '@/shared/data/stationMappings';
import type { Station, NextTrainsResponse } from '@/shared/types/metro';
import { logger } from '@/shared/utils/logger';

type PlatformResponse = {
  stop_id: string;
  destino: string;
  comboio?: string;
  comboio2?: string;
  comboio3?: string;
  tempoChegada1?: string;
  tempoChegada2?: string;
  tempoChegada3?: string;
};

const fetchStationWaitingTimes = async (stationId: string): Promise<Station | null> => {
  try {
    const response = await apiFetch(`/tempoEspera/Estacao/${stationId}`);
    const data = await response.json();

    if (data.codigo !== '200' || !data.resposta || data.resposta.length === 0) {
      throw new Error('Invalid response format or no data received');
    }

    const stationData =
      getStationById(stationId) ||
      (() => {
        throw new Error('Station data not found in mappings');
      })();

    const station: Station = {
      id: stationId,
      name: stationData.name,
      coordinates: stationData.coordinates,
      lines: stationData.lines,
      isTransfer: stationData.isTransfer,
      isTerminal: stationData.isTerminal,
      nextTrains: data.resposta.flatMap((platform: PlatformResponse) => {
        const trains: NextTrainsResponse = {
          destination: '',
          train1: '',
          time1: '',
          train2: '',
          time2: '',
          train3: '',
          time3: '',
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
      }),
    };

    if (station.isTerminal) {
      const processedDestinations = new Set<string>();
      station.nextTrains = station.nextTrains.filter((train) => {
        if (train.destination === station.name) return false;
        if (processedDestinations.has(train.destination)) return false;
        processedDestinations.add(train.destination);
        return true;
      });
    }

    return station;
  } catch (error) {
    logger.error('Error fetching station:', error);
    return null;
  }
};

export { fetchStationWaitingTimes };
export type { PlatformResponse };
