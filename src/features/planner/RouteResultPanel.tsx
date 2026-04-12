import React from 'react';

import { RouteLeg } from './RouteLeg';

import styles from './PlanearViagem.module.scss';

type RouteSegment = {
  type: 'travel' | 'line-change';
  from: string;
  to: string;
  line?: string;
  time: number;
  stations: number;
};

type RouteResult = {
  totalTime: number;
  stations: number;
  lineChanges: number;
  route: RouteSegment[];
};

type RouteResultPanelProps = {
  results: RouteResult;
};

const RouteResultPanel: React.FC<RouteResultPanelProps> = ({ results }) => {
  return (
    <div className={styles.card} aria-live='polite'>
      <h2 className={styles.sectionTitle}>Resultado</h2>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⏱</span>
          <span className={styles.statLabel}>Tempo Total</span>
          <span className={styles.statValue}>{results.totalTime} min</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🚇</span>
          <span className={styles.statLabel}>Estações</span>
          <span className={styles.statValue}>{results.stations}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔄</span>
          <span className={styles.statLabel}>Mudanças de Linha</span>
          <span className={styles.statValue}>{results.lineChanges}</span>
        </div>
      </div>

      <hr className={styles.divider} />

      <h3 className={styles.sectionTitle}>Itinerário Detalhado</h3>

      <div className={styles.itinerary}>
        {results.route.map((leg, index) => (
          <RouteLeg key={index} {...leg} />
        ))}
      </div>

      <div className={styles.note}>
        <strong>Nota:</strong> Este é um planeador conceptual. Os tempos são estimativas e podem
        variar consoante o horário, ocupação das estações e outros fatores.
      </div>
    </div>
  );
};

export { RouteResultPanel };
export type { RouteResult, RouteSegment };
