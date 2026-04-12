import React from 'react';
import { useParams } from 'react-router-dom';

import { Spinner } from '@/shared/components/Spinner';
import { lines } from '@/shared/data/staticData';
import { useTrain } from '@/shared/hooks/useTrain';
import { getStationNameById } from '@/shared/utils/metroUtils';

import { StationArrivalRow } from './StationArrivalRow';

import styles from './TrainDetail.module.scss';

const LINE_CLASS: Record<string, string> = {
  Azul: styles.lineAzul ?? '',
  Amarela: styles.lineAmarela ?? '',
  Verde: styles.lineVerde ?? '',
  Vermelha: styles.lineVermelha ?? '',
};

const TrainDetail: React.FC = () => {
  const { trainId } = useParams<{ trainId: string }>();
  const { train, trainInfo, loading, error } = useTrain(trainId);

  if (!trainId) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.error}>Train ID not found</h2>
        </div>
      </div>
    );
  }

  if (loading) return <Spinner />;

  if (error || !train || !trainInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.error}>{error || 'Train information not available'}</h2>
          <p>
            The train you're looking for may have completed its journey or the information is
            temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  const lineStations = lines[trainInfo.line]?.stations;

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${LINE_CLASS[trainInfo.line] ?? ''}`}>
        <div className={styles.titleRow}>
          <span className={styles.trainIcon}>🚇</span>
          <h1 className={styles.title}>Train {trainId}</h1>
          <span className={styles.lineBadge}>{trainInfo.line}</span>
        </div>

        <p className={styles.direction}>
          Direction: <strong>{trainInfo.destination}</strong>
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Journey Information</h2>
          {trainInfo.nextStations.map((station, index) => (
            <StationArrivalRow
              key={`${station.stationId}-${index}`}
              stationName={station.stationName}
              arrivalTime={station.arrivalTime}
              lineColor={trainInfo.lineColor}
              isNext={index === 0}
            />
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Line Information</h2>
          <div className={styles.infoRow}>
            <span>Line:</span>
            <strong>{trainInfo.line}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Terminals:</span>
            <span className={styles.terminals}>
              {lineStations && (
                <>
                  <span>{getStationNameById(lineStations[0])}</span>
                  <span>→</span>
                  <span>{getStationNameById(lineStations[lineStations.length - 1])}</span>
                </>
              )}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span>Total Stations:</span>
            <strong>{lineStations?.length ?? 'N/A'}</strong>
          </div>
        </section>
      </div>
    </div>
  );
};

export { TrainDetail };
