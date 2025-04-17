import TrainMap from '../components/TrainMap';

const Home: React.FC = () => {

  return (
    <div className="home-page">
      <h1>Lisbon Metro Station Map</h1>
      
      {
        <div className="metro-container">
          <div className="map-container" style={{ height: '800px', width: '100%', border: '1px solid #ccc' }}>
            <TrainMap />
          </div>
        </div>
      }
    </div>
  );
};

export default Home;