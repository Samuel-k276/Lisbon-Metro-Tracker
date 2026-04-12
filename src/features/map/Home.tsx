import React from 'react';
import { Link } from 'react-router';

import { useLineStates } from '@/shared/contexts/LineStateContext';
import { Routes } from '@/shared/routes';

import { TrainMap } from './TrainMap';

import styles from './Home.module.scss';

const Home: React.FC = () => {
  const { lineStates } = useLineStates();

  const affectedLines = lineStates.filter(
    (line) => line.status.toLowerCase() !== 'normal' && line.status.toLowerCase() !== 'ok',
  );

  return (
    <div className={styles.homePage}>
      {affectedLines.length > 0 && (
        <Link to={Routes.ALERTS} className={styles.alertBanner}>
          <span className={styles.alertIcon}>⚠</span>
          <span>
            {affectedLines.length === 1
              ? `Linha ${affectedLines[0]?.name} com perturbações`
              : `${affectedLines.length} linhas com perturbações`}
          </span>
        </Link>
      )}
      <h1>Mapa do Metro de Lisboa</h1>
      <div className={styles.mapContainer}>
        <TrainMap />
      </div>
    </div>
  );
};

export { Home };
