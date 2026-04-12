import React, { useEffect, useState } from 'react';
import { fetchLineStateAll } from '@/shared/api/fetchLineState';
import type { LineState } from '@/shared/types/metro';
import { LineStatusCard } from './LineStatusCard';
import styles from './Alerts.module.scss';

const Alerts: React.FC = () => {
  const [lineStates, setLineStates] = useState<LineState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLineStates = async () => {
      try {
        const states = await fetchLineStateAll();
        setLineStates(states);
      } catch {
        setError('Failed to fetch line states');
      } finally {
        setLoading(false);
      }
    };

    getLineStates();
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Metro Line Status</h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      )}

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
