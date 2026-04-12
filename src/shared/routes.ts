export const Routes = {
  HOME: "/",
  ABOUT: "/sobre",
  ALERTS: "/alertas",
  FARES: "/tarifarios",
  PLANNER: "/planear-viagem",
  STATION: "/station/:stationId",
  TRAIN: "/train/:trainId",
} as const;

export const stationPath = (stationId: string) => `/station/${stationId}`;
export const trainPath = (trainId: string) => `/train/${trainId}`;
