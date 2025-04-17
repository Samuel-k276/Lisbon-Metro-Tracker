/**
 * Represents the arrival information for a train at a metro station
 */
export interface TrainArrival {
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
}

