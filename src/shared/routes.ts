const Routes = {
  HOME: '/',
  ALERTS: '/alertas',
  PLANNER: '/planear-viagem',
  STATION: '/station/:stationId',
  TRAIN: '/train/:trainId',
} as const;

const stationPath = (stationId: string) => `/station/${stationId}`;
const trainPath = (trainId: string) => `/train/${trainId}`;

export { Routes, stationPath, trainPath };
