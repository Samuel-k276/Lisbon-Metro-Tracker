# Lisbon Metro Tracker

Real-time Lisbon Metro tracking app built with React 19, TypeScript 6, and Vite 8.

## Features

- **Live Map** — real-time train positions on an interactive canvas map
- **Station Details** — upcoming trains and waiting times per station
- **Journey Planner** — shortest route between any two stations (Dijkstra with transfer penalty)
- **Service Alerts** — current status of all four metro lines

## Tech Stack

- React 19 + TypeScript 6 + Vite 8 (Rolldown)
- Konva/React-Konva for canvas map rendering
- SCSS Modules for styling
- Vitest + React Testing Library (107 tests)
- oxlint + oxfmt for linting and formatting
- Deployed on Vercel

## Getting Started

```bash
yarn install
yarn dev
```

Requires `VITE_METRO_API_TOKEN` env var — Bearer token for the Lisbon Metro API.

## Scripts

```bash
yarn dev          # Dev server (auto-opens browser)
yarn build        # TypeScript check + production build
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
  main.tsx              # Entry point, router, providers
  features/             # Feature modules
    map/                #   Real-time train map (Konva canvas)
    stations/           #   Station detail page
    trains/             #   Train detail page
    alerts/             #   Line status cards
    planner/            #   Journey planner + graph algorithm
  layout/               # Header, Footer
  shared/
    api/                # One file per API endpoint
    components/         # Spinner, ErrorBoundary, NotFound
    contexts/           # TrainContext (global train data, refreshes every 15s)
    data/               # Static metro data (stations, lines, mappings)
    hooks/              # useStation, useTrain, useLineStates, useNavigateTo
    routes.ts           # Centralized route paths
    styles/             # SCSS variables + global styles
    types/              # TypeScript types
    utils/              # Helpers + logger
```

## License

MIT
