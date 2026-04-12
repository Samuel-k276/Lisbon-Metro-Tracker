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
- Code identifiers and comments in English
- UI-facing strings in Portuguese (pt-PT)
- SCSS module class names in camelCase
- State management via React Context only — no external state libs
- Use `@/` path alias when shorter than relative imports
- Never use inline styles — use SCSS modules and CSS custom properties via class names
- Use `$variables` from `shared/styles/_variables.scss` for colors, breakpoints — no hardcoded values
- Use `logger` from `shared/utils/logger.ts` instead of `console.*` — dev-only logging
- Tests live next to source in `spec/` dirs (e.g., `features/alerts/spec/Alerts.spec.tsx`)
- Use shared mock helpers from `shared/hooks/spec/` for hook mocking in tests
- All images in WebP format
- Lazy-load non-home routes via `React.lazy` + `Suspense`
- Accessibility: aria labels, keyboard navigation, semantic HTML, skip link

## Architecture

Real-time Lisbon Metro tracker: React 19 + TypeScript 6 + Vite 8 (Rolldown), with SVG map rendering and SCSS modules for styling. 3 prod deps: react, react-dom, react-router.

### Project Structure

```
src/
  main.tsx              # Entry point, App component, router, lazy routes
  features/
    map/                # SVG map: TrainMap, StationMarker, TrainMarker, Home
    stations/           # StationDetail, StationInfo, NextTrainsTable
    trains/             # TrainDetail, StationArrivalRow
    alerts/             # Alerts, LineStatusCard
    planner/            # PlanearViagem, RouteResultPanel, RouteLeg, graph.ts
  layout/               # Header, Footer
  shared/
    api/                # One file per endpoint (client.ts, fetchTrainData, etc.)
    components/         # Spinner, ErrorBoundary, NotFound
    contexts/           # TrainContext (global train data, refreshes every 15s)
    data/               # Static metro data (stations, lines, mappings)
    hooks/              # useStation, useTrain, useLineStates, useNavigateTo
    routes.ts           # Centralized route paths + path helpers
    styles/             # SCSS variables + global styles
    types/              # TypeScript types
    utils/              # helpers, metroUtils, logger
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

Trains are positioned on an SVG coordinate system (1034.4×720):
- `stationCoordinates` in `staticData.ts` maps station IDs → {x,y} (NOT geographic coords)
- Position interpolation: `percentage = 1 - (timeToNext / MAX_TIME_BETWEEN_STATIONS)`
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

Pure SVG with `StationMarker` and `TrainMarker` components. Background map image, station circles (transfer stations as concentric circles), train markers with direction arrows. All interactive — native DOM events, keyboard accessible, no canvas.
