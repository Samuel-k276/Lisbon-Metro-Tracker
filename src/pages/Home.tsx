import React, { useState, useEffect } from 'react';
import TrainMap from '../components/TrainMap';
import { Station } from '../types/metro';
import { fetchStations } from '../api/metro'; // Adjust the import path as necessary

const Home: React.FC = () => {
  const [_, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="home-page">
      <h1>Lisbon Metro Station Map</h1>
      
      {loading ? (
        <p>Loading stations...</p>
      ) : (
        <div className="metro-container">
          <div className="map-container" style={{ height: '800px', width: '100%', border: '1px solid #ccc' }}>
            <TrainMap />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;