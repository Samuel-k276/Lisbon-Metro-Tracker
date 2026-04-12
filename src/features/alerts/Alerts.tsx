import React from 'react';
import { useLineStates } from '@/shared/hooks/useLineStates';
import { Spinner } from '@/shared/components/Spinner';
import { LineStatusCard } from './LineStatusCard';
import styles from './Alerts.module.scss';

const Alerts: React.FC = () => {
  const { lineStates, loading, error } = useLineStates();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Metro Line Status</h1>

      {loading && <Spinner />}

      {error && (
        <div className={styles.errorBanner}>
          <strong>Error</strong>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className={styles.grid}>
          {lineStates.map((lineState, index) => (
            <LineStatusCard key={index} lineState={lineState} />
          ))}
        </div>
      )}
    </div>
  );
};

export { Alerts };
