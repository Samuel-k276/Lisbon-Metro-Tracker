import React, { useState } from 'react';
import { Station } from '../types/metro';

interface StationSelectorProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({ stations, onSelectStation }) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Ensure stations is always an array
  const safeStations = Array.isArray(stations) ? stations : [];

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    onSelectStation(station);
  };

  return (
    <div className="station-selector">
      <h3>Metro Stations</h3>
      <div className="station-list">
        {safeStations.map((station) => (
          <div 
            key={station.id}
            className={`station-item ${selectedStation?.id === station.id ? 'selected' : ''}`}
            onClick={() => handleStationClick(station)}
          >
            {station.name}
          </div>
        ))}
        {safeStations.length === 0 && (
          <div>No stations available</div>
        )}
      </div>
    </div>
  );
};

export default StationSelector;
