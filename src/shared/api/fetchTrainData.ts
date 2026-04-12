import type { Train } from '@/shared/types/metro';
import type { TrainArrival } from '@/shared/api/responseTypes';
import { getDestinationId } from '@/shared/data/stationMappings';
import { apiFetch } from '@/shared/api/client';

const fetchTrainData = async (): Promise<Record<string, Train>> => {
  try {
    const response = await apiFetch('/tempoEspera/Estacao/todos');
    const data = await response.json();

    if (data.codigo !== '200' || !data.resposta || data.resposta.length === 0) {
      throw new Error('Invalid response format or no data received');
    }

    const trains: Record<string, Train> = {};

    for (const response of data.resposta) {
      const trainArrival = response as TrainArrival;

      const trainData = [
        { id: trainArrival.comboio, time: trainArrival.tempoChegada1 },
        { id: trainArrival.comboio2, time: trainArrival.tempoChegada2 },
        { id: trainArrival.comboio3, time: trainArrival.tempoChegada3 },
      ];

      for (const train of trainData) {
        if (train.id && train.time) {
          if (!trains[train.id]) {
            trains[train.id] = {
              id: train.id,
              stationArrivals: [],
            };
          }
          trains[train.id]!.stationArrivals.push([
            parseInt(train.time),
            [trainArrival.stop_id.toString(), getDestinationId(trainArrival.destino)],
          ]);
        }
      }
    }

    // Sort each train's arrivals by time ascending
    for (const train of Object.values(trains)) {
      train.stationArrivals.sort((a, b) => a[0] - b[0]);
    }

    return trains;
  } catch (error) {
    console.error('Error fetching waiting times:', error);
    return {};
  }
};

export { fetchTrainData };
