import React, { useState, useEffect } from 'react';

import styles from './LastUpdated.module.scss';

type LastUpdatedProps = {
  timestamp: number | null;
};

const formatElapsed = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 5) return 'agora';
  if (seconds < 60) return `há ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `há ${minutes}m`;
};

const LastUpdated: React.FC<LastUpdatedProps> = ({ timestamp }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!timestamp) return;

    const update = () => setElapsed(formatElapsed(Date.now() - timestamp));
    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp) return null;

  return <span className={styles.badge}>Atualizado {elapsed}</span>;
};

export { LastUpdated };
