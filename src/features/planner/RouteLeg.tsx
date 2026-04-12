import React from 'react';

import styles from './PlanearViagem.module.scss';

type RouteLegProps = {
  type: 'travel' | 'line-change';
  from: string;
  to: string;
  line?: string;
  time: number;
  stations: number;
};

const LINE_CLASS: Record<string, string> = {
  Azul: styles.lineAzul ?? '',
  Amarela: styles.lineAmarela ?? '',
  Verde: styles.lineVerde ?? '',
  Vermelha: styles.lineVermelha ?? '',
};

const getLineClass = (name: string): string => LINE_CLASS[name] ?? '';

const LineChip: React.FC<{ name: string }> = ({ name }) => (
  <span className={`${styles.chip} ${getLineClass(name)}`}>{name}</span>
);

const TravelLeg: React.FC<RouteLegProps> = ({ from, to, line, time, stations }) => (
  <div className={`${styles.legTravel} ${getLineClass(line ?? '')}`}>
    <div className={styles.legHeader}>
      <span className={styles.legIcon}>🚇</span>
      <span>
        {from} → {to}
      </span>
      {line && <LineChip name={line} />}
    </div>
    <div className={styles.legMeta}>
      {stations} estações • {time} minutos
    </div>
  </div>
);

const TransferLeg: React.FC<RouteLegProps> = ({ from, to, time }) => (
  <div className={styles.legTransfer}>
    <div className={styles.legHeader}>
      <span className={styles.legIcon}>🚶</span>
      <span>Mudança de Linha:</span>
      <LineChip name={from} />
      <span>→</span>
      <LineChip name={to} />
    </div>
    <div className={styles.legMeta}>Tempo estimado: {time} minutos</div>
  </div>
);

const RouteLeg: React.FC<RouteLegProps> = (props) => {
  if (props.type === 'travel') return <TravelLeg {...props} />;
  return <TransferLeg {...props} />;
};

export { RouteLeg };
export type { RouteLegProps };
