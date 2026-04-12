import { TrainMap } from '../components/TrainMap';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <h1>Lisbon Metro Station Map</h1>
      <div className={styles.metroContainer}>
        <div className={styles.mapContainer}>
          <TrainMap />
        </div>
      </div>
    </div>
  );
};

export { Home };
