import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';

import { lines } from '@/shared/data/staticData';
import { stationMappings } from '@/shared/data/stationMappings';
import { stationPath } from '@/shared/routes';
import { getLineColor } from '@/shared/utils/metroUtils';

import styles from './LineStrip.module.scss';

type LineStripProps = {
  lineName: string;
  currentStationId: string;
};

const LineStrip: React.FC<LineStripProps> = ({ lineName, currentStationId }) => {
  const lineData = lines[lineName];
  const trackRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!trackRef.current || !currentRef.current) return;

    const track = trackRef.current;
    const current = currentRef.current;
    const offset = current.offsetLeft - track.clientWidth / 2 + current.clientWidth / 2;
    track.scrollLeft = Math.max(0, offset);
  }, [currentStationId]);

  if (!lineData) return null;

  const lineColor = getLineColor(lineName);

  return (
    <div className={styles.strip}>
      <span className={styles.lineName} style={{ color: lineColor }}>
        {lineName}
      </span>
      <div className={styles.track} ref={trackRef}>
        <div className={styles.rail} style={{ backgroundColor: lineColor }} />
        <div className={styles.stations}>
          {lineData.stations.map((id) => {
            const name = stationMappings[id]?.name ?? id;
            const isCurrent = id === currentStationId;

            return (
              <Link
                key={id}
                ref={isCurrent ? currentRef : undefined}
                to={stationPath(id)}
                className={`${styles.station} ${isCurrent ? styles.current : ''}`}
                title={name}
              >
                <span
                  className={styles.dot}
                  style={{
                    borderColor: lineColor,
                    backgroundColor: isCurrent ? lineColor : 'white',
                  }}
                />
                <span className={styles.label}>{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { LineStrip };
