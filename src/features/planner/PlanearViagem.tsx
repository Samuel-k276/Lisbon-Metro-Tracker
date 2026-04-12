import React, { useState } from 'react';

import { metroGraph } from '@/features/planner/graph';
import { stationMappings } from '@/shared/data/stationMappings';

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

const stations = Object.values(stationMappings)
  .map((station) => ({ id: station.id, name: station.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const PlanearViagem: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<RouteResult | null>(null);

  const swapOriginDestination = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const calculateRoute = () => {
    if (!origin || !destination) {
      alert('Por favor, selecione a origem e o destino');
      return;
    }

    const result = metroGraph.shortestPath(origin, destination);
    const processedRoute = metroGraph.formatPathForUI(result);

    const totalTime = processedRoute.segments.reduce((total, seg) => total + seg.time, 0);
    const stationCount = processedRoute.segments
      .filter((seg) => seg.type === 'travel')
      .reduce((total, seg) => total + seg.stations, 0);

    setResults({
      totalTime,
      stations: stationCount,
      lineChanges: processedRoute.transfers,
      route: processedRoute.segments.map((seg) => ({
        ...seg,
        type: seg.type === 'transfer' ? 'line-change' : 'travel',
      })),
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Planear Viagem</h1>
      <p className={styles.description}>
        Utilize este planeador para calcular a melhor rota entre duas estações do Metro de Lisboa. O
        sistema vai calcular o caminho mais rápido, incluindo mudanças de linha necessárias.
      </p>

      <div className={styles.card}>
        <fieldset className={styles.formRow}>
          <legend className={styles.srOnly}>Selecionar estações de origem e destino</legend>
          <div className={styles.selectWrapper}>
            <label htmlFor='origem-select'>Estação de Origem</label>
            <select id='origem-select' value={origin} onChange={(e) => setOrigin(e.target.value)}>
              <option value=''>Selecionar...</option>
              {stations.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.swapButton} onClick={swapOriginDestination}>
            ⇅
          </button>

          <div className={styles.selectWrapper}>
            <label htmlFor='destino-select'>Estação de Destino</label>
            <select
              id='destino-select'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value=''>Selecionar...</option>
              {stations.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className={styles.submitRow}>
          <button className={styles.submitButton} onClick={calculateRoute}>
            Calcular Rota
          </button>
        </div>
      </div>

      {results && (
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
      )}
    </div>
  );
};

export { PlanearViagem };
