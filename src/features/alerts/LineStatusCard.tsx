import React from 'react';
import type { LineState } from '@/shared/types/metro';
import { LINE_COLORS } from '@/shared/data/metroLines';
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

const LINE_GRADIENTS: Record<string, { primary: string; gradient: string }> = {
  azul: {
    primary: LINE_COLORS.Azul,
    gradient: `linear-gradient(135deg, #93c5fd 0%, ${LINE_COLORS.Azul} 100%)`,
  },
  amarela: {
    primary: LINE_COLORS.Amarela,
    gradient: `linear-gradient(135deg, #fde68a 0%, ${LINE_COLORS.Amarela} 100%)`,
  },
  verde: {
    primary: LINE_COLORS.Verde,
    gradient: `linear-gradient(135deg, #6ee7b7 0%, ${LINE_COLORS.Verde} 100%)`,
  },
  vermelha: {
    primary: LINE_COLORS.Vermelha,
    gradient: `linear-gradient(135deg, #fca5a5 0%, ${LINE_COLORS.Vermelha} 100%)`,
  },
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'normal':
      return '#10b981';
    case 'conditional':
    case 'conditioned':
      return '#f59e0b';
    case 'interrupted':
    case 'closed':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const getStatusIcon = (status: string): string => (status === 'Ok' ? '\u2713' : '\u26A0\uFE0F');

type LineStatusCardProps = {
  lineState: LineState;
};

const LineStatusCard: React.FC<LineStatusCardProps> = ({ lineState }) => {
  const key = lineState.name.toLowerCase();
  const lineStyle = LINE_GRADIENTS[key];
  const statusColor = getStatusColor(lineState.status);

  return (
    <div className={styles.card}>
      <div className={styles.statusStripe} style={{ backgroundColor: statusColor }} />

      <div className={styles.cardHeader} style={{ background: lineStyle?.gradient }}>
        <div
          className={styles.lineIconWrapper}
          style={{ border: `1.5px solid ${lineStyle?.primary}` }}
        >
          <img src={LINE_IMAGES[key] ?? linhaAzulImg} alt={`Linha ${lineState.name}`} />
        </div>
        <h2 className={styles.lineName}>{LINE_NAMES[key] ?? lineState.name}</h2>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Status:</span>
          <span
            className={styles.statusChip}
            style={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
              border: `1px solid ${statusColor}`,
            }}
          >
            {getStatusIcon(lineState.status)} {lineState.status}
          </span>
        </div>

        {lineState.message && lineState.message !== '0' && (
          <div
            className={styles.message}
            style={{ '--quote-color': lineStyle?.primary } as React.CSSProperties}
          >
            <p>{lineState.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { LineStatusCard };
