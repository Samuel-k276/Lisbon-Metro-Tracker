import { useState, useEffect } from "react";
import type { Station } from "@/shared/types/metro";
import { fetchStationWaitingTimes } from "@/shared/api/fetchStationWaitingTimes";

type UseStationResult = {
  station: Station | null;
  loading: boolean;
  error: string | null;
};

const useStation = (stationId: string | undefined): UseStationResult => {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) {
      setLoading(false);
      setError("No station ID provided");
      return;
    }

    let cancelled = false;

    const getStationData = async () => {
      setLoading(true);
      setError(null);

      const data = await fetchStationWaitingTimes(stationId);

      if (cancelled) return;

      if (data) {
        setStation(data);
      } else {
        setError(`Failed to load station ${stationId}`);
        setStation(null);
      }

      setLoading(false);
    };

    getStationData();

    return () => {
      cancelled = true;
    };
  }, [stationId]);

  return { station, loading, error };
};

export { useStation };
export type { UseStationResult };
