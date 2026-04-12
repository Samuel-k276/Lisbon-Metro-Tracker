import React from 'react';
import type { LineState } from '@/shared/types/metro';
import linhaAzulImg from '@/assets/linhaAzul.png';
import linhaAmarelaImg from '@/assets/linhaAmarela.png';
import linhaVerdeImg from '@/assets/linhaVerde.png';
import linhaVermelhaImg from '@/assets/linhaVermelha.png';
import styles from './Alerts.module.scss';

const LINE_IMAGES: Record<string, string> = {
  azul: linhaAzulImg,
  amarela: linhaAmarelaImg,
  verde: linhaVerdeImg,
  vermelha: linhaVermelhaImg,
};

const LINE_NAMES: Record<string, string> = {
  azul: 'Azul (Blue)',
  amarela: 'Amarela (Yellow)',
  verde: 'Verde (Green)',
  vermelha: 'Vermelha (Red)',
};

const LINE_CLASS: Record<string, string> = {
  azul: styles.lineAzul ?? '',
  amarela: styles.lineAmarela ?? '',
  verde: styles.lineVerde ?? '',
  vermelha: styles.lineVermelha ?? '',
} as Record<string, string>;

const STATUS_CLASS: Record<string, string> = {
  normal: styles.statusNormal ?? '',
  conditional: styles.statusConditional ?? '',
  conditioned: styles.statusConditioned ?? '',
  interrupted: styles.statusInterrupted ?? '',
  closed: styles.statusClosed ?? '',
} as Record<string, string>;

const getStatusIcon = (status: string): string => (status === 'Ok' ? '\u2713' : '\u26A0\uFE0F');

type LineStatusCardProps = {
  lineState: LineState;
};

const LineStatusCard: React.FC<LineStatusCardProps> = ({ lineState }) => {
  const key = lineState.name.toLowerCase();
  const lineClass = LINE_CLASS[key] ?? '';
  const statusClass = STATUS_CLASS[lineState.status.toLowerCase()] ?? styles.statusUnknown;

  return (
    <div className={`${styles.card} ${lineClass} ${statusClass}`}>
      <div className={styles.statusStripe} />

      <div className={styles.cardHeader}>
        <div className={styles.lineIconWrapper}>
          <img src={LINE_IMAGES[key] ?? linhaAzulImg} alt={`Linha ${lineState.name}`} />
        </div>
        <h2 className={styles.lineName}>{LINE_NAMES[key] ?? lineState.name}</h2>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Status:</span>
          <span className={styles.statusChip}>
            {getStatusIcon(lineState.status)} {lineState.status}
          </span>
        </div>

        {lineState.message && lineState.message !== '0' && (
          <div className={styles.message}>
            <p>{lineState.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { LineStatusCard };
