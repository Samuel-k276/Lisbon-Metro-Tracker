# Lisbon Metro Tracker

Real-time Lisbon Metro tracking app built with React 19, TypeScript 6, and Vite 8.

## Features

- **Live Map** — real-time train positions on an interactive SVG map
- **Station Details** — upcoming trains and waiting times per station
- **Journey Planner** — shortest route between any two stations (Dijkstra with transfer penalty)
- **Service Alerts** — current status of all four metro lines

## Tech Stack

- React 19 + TypeScript 6 + Vite 8 (Rolldown)
- SVG for interactive map rendering (zero canvas dependencies)
- SCSS Modules for styling
- Vitest + React Testing Library (126 tests, 84% coverage)
- oxlint (100 rules) + oxfmt for linting and formatting
- Lazy-loaded routes with React.lazy + Suspense
- Deployed on Vercel

**3 production dependencies:** react, react-dom, react-router.

## Getting Started

```bash
yarn install
yarn dev
```

Requires `VITE_METRO_API_TOKEN` env var — Bearer token for the Lisbon Metro API.

## Scripts

```bash
yarn dev          # Dev server (auto-opens browser)
yarn build        # TypeScript check + production build (~350ms)
yarn preview      # Preview production build
yarn test         # Run tests
yarn test:watch   # Watch mode
yarn test:coverage # Coverage report
yarn lint         # Lint with oxlint
yarn fmt          # Format with oxfmt
```

## Project Structure

```
src/
  main.tsx              # Entry point, router, lazy routes
  features/
    map/                #   SVG train map (StationMarker, TrainMarker)
    stations/           #   Station detail (StationInfo, NextTrainsTable)
    trains/             #   Train detail (StationArrivalRow)
    alerts/             #   Line status (LineStatusCard)
    planner/            #   Journey planner (RouteResultPanel, RouteLeg, graph)
  layout/               # Header, Footer
  shared/
    api/                # One file per API endpoint + shared client
    components/         # Spinner, ErrorBoundary, NotFound
    contexts/           # TrainContext (refreshes every 15s)
    data/               # Static metro data (stations, lines, mappings)
    hooks/              # useStation, useTrain, useLineStates, useNavigateTo
    routes.ts           # Centralized route paths
    styles/             # SCSS variables + global styles
    types/              # TypeScript types
    utils/              # Helpers + logger
```

## Bundle

| Chunk | Size (gzip) |
|-------|-------------|
| App (initial) | 3.9 KB |
| React | 73.6 KB |
| Lazy routes | 1.6–10.4 KB each |
| CSS | 1.9 KB initial |

Total initial load: ~78 KB gzipped.

## License

MIT
