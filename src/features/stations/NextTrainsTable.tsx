import React from 'react';

import type { NextTrainsResponse } from '@/shared/types/metro';
import { formatTimeInSeconds } from '@/shared/utils/helpers';

import styles from './StationDetail.module.scss';

type NextTrainsTableProps = {
  trains: NextTrainsResponse[];
};

const NextTrainsTable: React.FC<NextTrainsTableProps> = ({ trains }) => {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Próximos Comboios</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Destino</th>
              <th>Tempo 1</th>
              <th>Tempo 2</th>
              <th>Tempo 3</th>
            </tr>
          </thead>
          <tbody>
            {trains.length > 0 ? (
              trains.map((train, index) => (
                <tr key={index}>
                  <td>{train.destination}</td>
                  <td>{formatTimeInSeconds(train.time1)}</td>
                  <td>{formatTimeInSeconds(train.time2)}</td>
                  <td>{formatTimeInSeconds(train.time3)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.emptyCell}>
                  Sem comboios previstos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { NextTrainsTable };
