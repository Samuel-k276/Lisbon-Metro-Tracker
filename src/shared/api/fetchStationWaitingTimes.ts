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

const parsePlatform = (
  platform: PlatformResponse,
  stationId: string,
): NextTrainsResponse | null => {
  if (!platform.comboio || !platform.tempoChegada1) return null;

  return {
    destination: getDestinationNameById(platform.destino, stationId),
    train1: platform.comboio,
    time1: platform.tempoChegada1,
    train2: platform.comboio2 ?? '',
    time2: platform.tempoChegada2 ?? '',
    train3: platform.comboio3 ?? '',
    time3: platform.tempoChegada3 ?? '',
  };
};

const deduplicateTerminalTrains = (
  trains: NextTrainsResponse[],
  stationName: string,
): NextTrainsResponse[] => {
  const seen = new Set<string>();
  return trains.filter((train) => {
    if (train.destination === stationName) return false;
    if (seen.has(train.destination)) return false;
    seen.add(train.destination);
    return true;
  });
};

const fetchStationWaitingTimes = async (stationId: string): Promise<Station | null> => {
  try {
    const response = await apiFetch(`/tempoEspera/Estacao/${stationId}`);
    const data = await response.json();

    if (data.codigo !== '200' || !data.resposta || data.resposta.length === 0) {
      throw new Error('Invalid response format or no data received');
    }

    const stationData = getStationById(stationId);
    if (!stationData) throw new Error('Station data not found in mappings');

    const nextTrains = (data.resposta as PlatformResponse[])
      .map((platform) => parsePlatform(platform, stationId))
      .filter((train): train is NextTrainsResponse => train !== null);

    return {
      id: stationId,
      name: stationData.name,
      coordinates: stationData.coordinates,
      lines: stationData.lines,
      isTransfer: stationData.isTransfer,
      isTerminal: stationData.isTerminal,
      nextTrains: stationData.isTerminal
        ? deduplicateTerminalTrains(nextTrains, stationData.name)
        : nextTrains,
    };
  } catch (error) {
    logger.error('Error fetching station:', error);
    return null;
  }
};

export { fetchStationWaitingTimes };
export type { PlatformResponse };
