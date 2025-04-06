import React, { useEffect, useState } from 'react';
import { Line, Train, Station } from '../types/metro';

interface TrainMapProps {
  line: Line;
  trains: Train[];
  stations: Station[];
}

const TrainMap: React.FC<TrainMapProps> = ({ line, stations }) => {
  const [mapReady, setMapReady] = useState(false);
  
  // Ensure stations is always an array
  const safeStations = Array.isArray(stations) ? stations : [];

  useEffect(() => {
    // Map initialization logic would go here
    // For example, if using a mapping library
    setMapReady(true);
  }, []);

  return (
    <div className="train-map" style={{ backgroundColor: '#f0f0f0', height: '500px', position: 'relative' }}>
      <h3>Line Map: {line.name}</h3>
      
      {mapReady && (
        <div className="map-container">
          {/* Render stations */}
          {safeStations.map(station => (
            <div 
              key={station.id} 
              className="station-marker"
              style={{ 
                position: 'absolute', 
                left: `${station.coordinates.x}px`, 
                top: `${station.coordinates.y}px` 
              }}
            >
              <div className="station-point" />
              <div className="station-name">{station.name}</div>
            </div>
          ))}
          
          {/* Draw line path */}
          <div 
            className="line-path" 
            style={{ backgroundColor: line.name }}
          />
          
          {safeStations.length === 0 && (
            <div>No stations to display</div>
          )}
        </div>
      )}
      
      {!mapReady && <div>Loading map...</div>}
    </div>
  );
};

export default TrainMap;