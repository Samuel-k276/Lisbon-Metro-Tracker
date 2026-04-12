import React, { useState } from "react";
import type { Station } from "@/shared/types/metro";
import styles from "./StationSelector.module.scss";

type StationSelectorProps = {
  stations: Station[];
  onSelectStation: (station: Station) => void;
};

const StationSelector: React.FC<StationSelectorProps> = ({ stations, onSelectStation }) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const safeStations = Array.isArray(stations) ? stations : [];

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    onSelectStation(station);
  };

  return (
    <div className={styles.stationSelector}>
      <h3>Metro Stations</h3>
      <div className={styles.stationList}>
        {safeStations.map((station) => (
          <div
            key={station.id}
            className={`${styles.stationItem} ${selectedStation?.id === station.id ? styles.selected : ""}`}
            onClick={() => handleStationClick(station)}
          >
            {station.name}
          </div>
        ))}
        {safeStations.length === 0 && <div>No stations available</div>}
      </div>
    </div>
  );
};

export { StationSelector };
