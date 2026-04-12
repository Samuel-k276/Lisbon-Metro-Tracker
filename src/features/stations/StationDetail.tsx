import React from 'react';
import { Link, useParams } from 'react-router';

import { Spinner } from '@/shared/components/Spinner';
import { stationMappings } from '@/shared/data/stationMappings';
import { useStation } from '@/shared/hooks/useStation';
import { stationPath, slugToStationId } from '@/shared/routes';
import { getLineNameFromDestination } from '@/shared/utils/helpers';

import { LineStrip } from './LineStrip';
import { NextTrainsTable } from './NextTrainsTable';
import { StationInfo } from './StationInfo';

import styles from './StationDetail.module.scss';

const stationIdByName = Object.fromEntries(
  Object.values(stationMappings).map((s) => [s.name, s.id]),
);

const COLOR_ORDER: Record<string, number> = {
  Azul: 1,
  Verde: 2,
  Amarela: 3,
  Vermelha: 4,
};

const StationDetail: React.FC = () => {
  const { stationSlug } = useParams<{ stationSlug: string }>();
  const stationId = stationSlug ? slugToStationId[stationSlug] : undefined;
  const { station, loading, error } = useStation(stationId);

  if (!stationSlug || !stationId) return <p>Estação não encontrada</p>;

  if (loading)
    return (
      <div aria-live='polite'>
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div aria-live='polite' className={styles.errorContainer}>
        <p className={styles.error} role='alert'>
          {error}
        </p>
      </div>
    );
  if (!station)
    return (
      <div aria-live='polite'>
        <p>Estação não encontrada</p>
      </div>
    );

  const sortedTrains = station.nextTrains
    ? [...station.nextTrains].sort((a, b) => {
        const orderA = COLOR_ORDER[getLineNameFromDestination(a.destination)] ?? 999;
        const orderB = COLOR_ORDER[getLineNameFromDestination(b.destination)] ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.destination.localeCompare(b.destination);
      })
    : [];

  return (
    <div className={styles.container} aria-live='polite'>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {station.name}
            {(Array.isArray(station.lines) ? station.lines : [station.lines]).map((line, i) => (
              <span key={i} className={`${styles.lineCircle} ${styles[`line${line}`] ?? ''}`} />
            ))}
          </h1>

          <div className={styles.destinations}>
            {sortedTrains.map((train) => {
              const destId = stationIdByName[train.destination];
              return destId ? (
                <Link key={train.destination} to={stationPath(destId)} className={styles.chip}>
                  {train.destination}
                </Link>
              ) : (
                <span key={train.destination} className={styles.chip}>
                  {train.destination}
                </span>
              );
            })}
            {sortedTrains.length === 0 && (
              <span className={styles.muted}>Sem destinos disponíveis</span>
            )}
          </div>
        </div>

        {(Array.isArray(station.lines) ? station.lines : [station.lines]).map((line) => (
          <LineStrip key={line} lineName={line} currentStationId={stationId} />
        ))}

        <div className={styles.grid}>
          <StationInfo station={station} />
          <NextTrainsTable trains={station.nextTrains ?? []} />
        </div>
      </div>
    </div>
  );
};

export { StationDetail };
