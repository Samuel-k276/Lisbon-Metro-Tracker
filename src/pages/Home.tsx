import React, { useState, useEffect } from 'react';
import StationSelector from '../components/StationSelector';
import { Station } from '../types/metro';
import { fetchStations } from '../api/metro'; // Adjust the import path as necessary

const Home: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const stationsData = await fetchStations();
        setStations(stationsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load stations', error);
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
  };

  return (
    <div className="home-page">
      <h1>Lisbon Metro Station Map</h1>
      
      {loading ? (
        <p>Loading stations...</p>
      ) : (
        <div className="metro-container">
          <div className="selector-container">
            <StationSelector 
              stations={stations} 
              onSelectStation={handleStationSelect} 
            />
          </div>
          
          {selectedStation && (
            <div className="station-detail">
              <h2>{selectedStation.name}</h2>
              <p>Coordinates: {selectedStation.coordinates.x}, {selectedStation.coordinates.y}</p>
              {/* Add more station details as needed */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default Home;