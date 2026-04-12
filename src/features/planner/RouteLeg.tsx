import React from 'react';

import styles from './PlanearViagem.module.scss';

type RouteLegProps = {
  tipo: 'viagem' | 'troca de linha';
  de: string;
  para: string;
  linha?: string;
  tempo: number;
  estacoes: number;
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

const TravelLeg: React.FC<RouteLegProps> = ({ de, para, linha, tempo, estacoes }) => (
  <div className={`${styles.legTravel} ${getLineClass(linha ?? '')}`}>
    <div className={styles.legHeader}>
      <span className={styles.legIcon}>🚇</span>
      <span>
        {de} → {para}
      </span>
      {linha && <LineChip name={linha} />}
    </div>
    <div className={styles.legMeta}>
      {estacoes} estações • {tempo} minutos
    </div>
  </div>
);

const TransferLeg: React.FC<RouteLegProps> = ({ de, para, tempo }) => (
  <div className={styles.legTransfer}>
    <div className={styles.legHeader}>
      <span className={styles.legIcon}>🚶</span>
      <span>Mudança de Linha:</span>
      <LineChip name={de} />
      <span>→</span>
      <LineChip name={para} />
    </div>
    <div className={styles.legMeta}>Tempo estimado: {tempo} minutos</div>
  </div>
);

const RouteLeg: React.FC<RouteLegProps> = (props) => {
  if (props.tipo === 'viagem') return <TravelLeg {...props} />;
  return <TransferLeg {...props} />;
};

export { RouteLeg };
export type { RouteLegProps };
