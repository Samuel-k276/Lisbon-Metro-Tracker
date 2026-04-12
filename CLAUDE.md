# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
yarn dev          # Vite dev server (auto-opens browser)
yarn build        # tsc && vite build
yarn preview      # Preview production build
yarn lint         # oxlint -c .oxlintrc.json src/
yarn fmt          # oxfmt src/ (auto-fix)
yarn fmt:check    # oxfmt --check src/
yarn test         # vitest run
yarn test:watch   # vitest (watch mode)
yarn test:coverage # vitest run --coverage
```

**Required env var**: `VITE_METRO_API_TOKEN` — Bearer token for the Lisbon Metro API.

**Git hooks** (`.githooks/`, activated via `yarn prepare`):
- pre-commit: auto-formats with oxfmt
- pre-push: checks formatting + lint, blocks if failing

## Code Style

Formatting (quotes, semicolons, trailing commas, import order) is handled by oxfmt — don't think about it.

- Always use `React.FC` for component typing
- Named exports only — no default exports
- Always use `type` instead of `interface` — use `enum` only when a type union gets unwieldy
- Comments and variable names in English
- SCSS module class names in camelCase
- State management via React Context only — no external state libs
- Use `@/` path alias when shorter than relative imports
- Never use inline styles — use SCSS modules and CSS custom properties via class names
- Use `$variables` from `shared/styles/_variables.scss` for colors, breakpoints — no hardcoded values
- Tests live next to source in `spec/` dirs (e.g., `features/alerts/spec/Alerts.spec.tsx`)
- Use shared mock helpers from `shared/hooks/spec/` for hook mocking in tests

## Architecture

Real-time Lisbon Metro tracker: React 19 + TypeScript 6 + Vite 8, with Konva canvas for map rendering and SCSS modules for styling.

### Project Structure

```
src/
  main.tsx              # Entry point, App component, router, providers
  features/             # Feature modules (map, stations, trains, alerts, planner)
  layout/               # Shell components (Header, Footer)
  shared/
    api/                # One file per API endpoint + shared client
    components/         # Shared UI (Spinner, ErrorBoundary, NotFound)
    contexts/           # TrainContext (global train data)
    data/               # Static metro data (stations, lines, mappings)
    hooks/              # Shared hooks (useStation, useTrain, useLineStates, useNavigateTo)
    routes.ts           # Centralized route paths
    styles/             # SCSS variables + global styles
    types/              # TypeScript types
    utils/              # Pure utility functions + logger
```

### Data Flow

```
Metro API (metrolisboa.pt:8243)
  → shared/api/ (one fetch function per endpoint)
  → TrainContext (shared/contexts/) — fetches every 15s, computes train positions
  → useTrains() / useTrain() / useStation() / useLineStates() hooks
  → Feature components
```

### Train Position System

Trains are positioned between stations on a canvas coordinate system (1034.4×720):
- `stationCoordinates` in `staticData.ts` maps station IDs → canvas {x,y} (NOT geographic coords)
- Position interpolation: `percentage = 1 - (timeToNext / MAX_TIME_BETWEEN_STATIONS)` between current and next station
- Train line determined by last character of train ID: A=Azul, B=Amarela, C=Verde, D=Vermelha

### Route Planning (`features/planner/graph.ts`)

Modified Dijkstra on a `MetroGraph` class:
- Edge weight = 1 (same line), transfer penalty = 3
- `shortestPath()` returns station ID sequence
- `formatPathForUI()` converts to segments with time estimates (2min/station, 4min/transfer)

### Station Identity

Three overlapping ID systems — all linked via `shared/data/stationMappings.ts`:
1. **Station ID**: 2-letter codes (e.g., "RB", "AM") used everywhere internally
2. **Station name**: human-readable (e.g., "Reboleira", "Alameda")
3. **API destination ID**: numeric strings (e.g., "1", "38") from the Metro API, mapped via `DestinationToID`

### Map Rendering (`features/map/TrainMap.tsx`)

Three Konva layers (background image, station circles, train markers) with HTML div overlays on top for click/hover interactivity. Transfer stations render as concentric circles. Konva props are canvas API — they cannot use CSS.
