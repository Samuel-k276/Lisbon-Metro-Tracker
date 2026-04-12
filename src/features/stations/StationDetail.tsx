import React from 'react';
import { useParams } from 'react-router-dom';
import { useStation } from '@/shared/hooks/useStation';
import { formatTimeInSeconds, getLineNameFromDestination } from '@/shared/utils/helpers';
import { getLineColor } from '@/shared/utils/metroUtils';
import styles from './StationDetail.module.scss';

const COLOR_ORDER: Record<string, number> = {
  Azul: 1,
  Verde: 2,
  Amarela: 3,
  Vermelha: 4,
};

const StationDetail: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const { station, loading, error } = useStation(stationId);

  if (!stationId) return <p>Station ID not found</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>Error loading station: {error}</p>;
  if (!station) return <p>Station not found</p>;

  const sortedTrains = station.nextTrains
    ? [...station.nextTrains].sort((a, b) => {
        const orderA = COLOR_ORDER[getLineNameFromDestination(a.destination)] ?? 999;
        const orderB = COLOR_ORDER[getLineNameFromDestination(b.destination)] ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.destination.localeCompare(b.destination);
      })
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {station.name}
            {(Array.isArray(station.lines) ? station.lines : [station.lines]).map((line, i) => (
              <span
                key={i}
                className={styles.lineCircle}
                style={{ backgroundColor: getLineColor(line) }}
              />
            ))}
          </h1>

          <div className={styles.destinations}>
            {sortedTrains.map((train) => (
              <span key={train.destination} className={styles.chip}>
                {train.destination}
              </span>
            ))}
            {sortedTrains.length === 0 && (
              <span className={styles.muted}>No destinations available</span>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <div>
            <h2 className={styles.sectionTitle}>Information</h2>
            <div className={styles.infoList}>
              <p>
                <strong>Name:</strong> {station.name}
              </p>
              <p>
                <strong>Lines:</strong>{' '}
                {Array.isArray(station.lines) ? station.lines.join(', ') : station.lines}
              </p>
              <p>
                <strong>Location:</strong> {station.coordinates.x}, {station.coordinates.y}
              </p>
            </div>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Next Trains</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>Time 1</th>
                    <th>Time 2</th>
                    <th>Time 3</th>
                  </tr>
                </thead>
                <tbody>
                  {station.nextTrains && station.nextTrains.length > 0 ? (
                    station.nextTrains.map((train, index) => (
                      <tr key={index}>
                        <td>{train.destination}</td>
                        <td>{formatTimeInSeconds(train.time1)}</td>
                        <td>{formatTimeInSeconds(train.time2)}</td>
                        <td>{formatTimeInSeconds(train.time3)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center' }}>
                        No upcoming trains
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { StationDetail };
