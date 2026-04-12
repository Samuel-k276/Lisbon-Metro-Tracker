import { apiFetch } from '@/shared/api/client';
import { getDestinationId } from '@/shared/data/stationMappings';
import type { Train } from '@/shared/types/metro';
import { logger } from '@/shared/utils/logger';

type TrainArrival = {
  stop_id: string;
  cais: string;
  hora: string;
  comboio: string;
  tempoChegada1: string;
  comboio2: string;
  tempoChegada2: string;
  comboio3: string;
  tempoChegada3: string;
  destino: string;
  sairServico: string;
  UT: string;
};

const fetchTrainData = async (): Promise<Record<string, Train>> => {
  try {
    const response = await apiFetch('/tempoEspera/Estacao/todos');
    const data = await response.json();

    if (data.codigo !== '200' || !data.resposta || data.resposta.length === 0) {
      throw new Error('Invalid response format or no data received');
    }

    const trains: Record<string, Train> = {};

    for (const arrival of data.resposta as TrainArrival[]) {
      const candidates = [
        { id: arrival.comboio, time: arrival.tempoChegada1 },
        { id: arrival.comboio2, time: arrival.tempoChegada2 },
        { id: arrival.comboio3, time: arrival.tempoChegada3 },
      ];

      for (const candidate of candidates) {
        if (!candidate.id || !candidate.time) continue;

        if (!trains[candidate.id]) {
          trains[candidate.id] = { id: candidate.id, stationArrivals: [] };
        }
        trains[candidate.id]!.stationArrivals.push([
          parseInt(candidate.time, 10),
          [arrival.stop_id.toString(), getDestinationId(arrival.destino)],
        ]);
      }
    }

    for (const train of Object.values(trains)) {
      train.stationArrivals.sort((a, b) => a[0] - b[0]);
    }

    return trains;
  } catch (error) {
    logger.error('Error fetching waiting times:', error);
    return {};
  }
};

export { fetchTrainData };
