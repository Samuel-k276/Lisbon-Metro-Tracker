import { stationMappings } from '@/shared/data/stationMappings';

const Routes = {
  HOME: '/',
  ALERTS: '/alertas',
  PLANNER: '/planear-viagem',
  STATION: '/estacao/:stationSlug',
  TRAIN: '/comboio/:trainId',
} as const;

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

const slugToStationId = Object.fromEntries(
  Object.values(stationMappings).map((s) => [toSlug(s.name), s.id]),
);

const stationPath = (stationId: string) => {
  const station = stationMappings[stationId];
  return station ? `/estacao/${toSlug(station.name)}` : `/estacao/${stationId}`;
};

const trainPath = (trainId: string) => `/comboio/${trainId}`;

export { Routes, stationPath, trainPath, toSlug, slugToStationId };
