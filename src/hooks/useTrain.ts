import { useState, useEffect } from 'react';
import { Train } from '../types/metro';
import { fetchTrainData } from '../api/metro';
import { getTrainLine } from '../utils/staticData';
import { getDestinationNameById } from '../utils/stationMappings';

export const useTrain = (trainId: string | undefined) => {
  const [train, setTrain] = useState<Train | null>(null);
  const [trainInfo, setTrainInfo] = useState<{
    line: string;
    lineColor: string;
    destination: string;
    nextStations: Array<{ stationId: string, stationName: string, arrivalTime: number }>;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainId) {
      setLoading(false);
      setError('No train ID provided');
      return;
    }

    const getTrainData = async () => {
      try {
        setLoading(true);
        const data = await fetchTrainData();
        
        if (!data[trainId]) {
          throw new Error(`Train ${trainId} not found`);
        }
        
        setTrain(data[trainId]);
        
        // Get the line color and name for the train
        const lineName = getTrainLine(trainId);
        const lineColor = lineName === 'Azul' ? '#0075BF' : 
                         lineName === 'Amarela' ? '#FFD800' :
                         lineName === 'Verde' ? '#00A9A6' :
                         lineName === 'Vermelha' ? '#ED1C24' : '#888888';
        
        // Process train arrivals for UI display
        const stationArrivals = Array.from(data[trainId].stationArrivals);
        if (stationArrivals.length > 0) {
          // The first entry has the next station and destination info
          const [_, firstStationInfo] = stationArrivals[0];
          const [__, destinationId] = firstStationInfo;
          
          // Format station arrivals into a more usable format for UI
          const nextStations = stationArrivals.map(([arrivalTime, stationInfo]) => {
            const [stationId] = stationInfo;
            return {
              stationId,
              stationName: stationId, // We'll replace this with real name in the component
              arrivalTime
            };
          });
          
          setTrainInfo({
            line: lineName,
            lineColor,
            destination: getDestinationNameById(destinationId, ''),
            nextStations
          });
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setTrain(null);
        setTrainInfo(null);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data only once when the component mounts or trainId changes
    getTrainData();
    
    // Removido o setInterval para evitar atualizações automáticas
    
  }, [trainId]);

  return { train, trainInfo, loading, error };
};