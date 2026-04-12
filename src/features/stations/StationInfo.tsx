import React from 'react';

import type { Station } from '@/shared/types/metro';

import styles from './StationDetail.module.scss';

type StationInfoProps = {
  station: Station;
};

const StationInfo: React.FC<StationInfoProps> = ({ station }) => {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Informação</h2>
      <div className={styles.infoList}>
        <p>
          <strong>Nome:</strong> {station.name}
        </p>
        <p>
          <strong>Linhas:</strong>{' '}
          {Array.isArray(station.lines) ? station.lines.join(', ') : station.lines}
        </p>
        <p>
          <strong>Localização:</strong> {station.coordinates.x}, {station.coordinates.y}
        </p>
      </div>
    </div>
  );
};

export { StationInfo };
