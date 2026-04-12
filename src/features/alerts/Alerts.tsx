import React from 'react';

import { Spinner } from '@/shared/components/Spinner';
import { useLineStates } from '@/shared/contexts/LineStateContext';

import { LineStatusCard } from './LineStatusCard';

import styles from './Alerts.module.scss';

const Alerts: React.FC = () => {
  const { lineStates, loading, error } = useLineStates();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Estado das Linhas</h1>

      <div aria-live='polite'>
        {loading && <Spinner />}

        {error && (
          <div className={styles.errorBanner} role='alert'>
            <strong>Erro</strong>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className={styles.grid}>
            {lineStates.map((lineState) => (
              <LineStatusCard key={lineState.name} lineState={lineState} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { Alerts };
