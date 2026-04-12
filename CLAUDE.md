# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
yarn dev       # Vite dev server
yarn build     # tsc && vite build
yarn preview   # Preview production build
yarn lint      # oxlint src/
yarn fmt       # oxfmt src/ (auto-fix)
yarn fmt:check # oxfmt --check src/
yarn test      # vitest run (all tests)
yarn test:watch # vitest (watch mode)
```

**Required env var**: `VITE_METRO_API_TOKEN` — Bearer token for the Lisbon Metro API.

**Git hooks** (`.githooks/`, activated via `yarn prepare`):
- pre-commit: auto-formats with oxfmt
- pre-push: checks formatting + lint, blocks if failing

## Code Style

- Always use `React.FC` for component typing
- Named exports only — no default exports
- Always use `type` instead of `interface` — use `enum` only when a type union gets unwieldy
- Always use semicolons
- Single quotes in JSX string props
- Comments and variable names in English
- SCSS module class names in camelCase
- State management via React Context only — no external state libs
- Use `@/` path alias when shorter than relative imports
- Never use inline styles — use SCSS modules and CSS custom properties via class names
- Don't worry about formatting — oxfmt handles it via git hooks

## Architecture

Real-time Lisbon Metro tracker: React 19 + TypeScript + Vite, with Konva canvas for map rendering and SCSS modules for styling.

### Data Flow

```
Metro API (metrolisboa.pt:8243)
  → src/api/metro.ts (fetch functions + response transforms)
  → TrainContext (src/contexts/TrainContext.tsx) — fetches every 10s, computes train positions
  → useTrains() hook consumed by components
```

### Train Position System

Trains are positioned between stations on a canvas coordinate system (1034.4×720):
- `stationCoordinates` in `staticData.ts` maps station IDs → canvas {x,y} (NOT geographic coords)
- Position interpolation: `percentage = 1 - (timeToNext / 240)` between current and next station
- Train line determined by last character of train ID: A=Azul, B=Amarela, C=Verde, D=Vermelha

### Route Planning (`src/utils/graph.ts`)

Modified Dijkstra on a `MetroGraph` class:
- Edge weight = 1 (same line), transfer penalty = 3
- `shortestPath()` returns station ID sequence
- `formatPathForUI()` converts to segments with time estimates (2min/station, 4min/transfer)

### Station Identity

Three overlapping ID systems — all linked via `src/utils/stationMappings.ts`:
1. **Station ID**: 2-letter codes (e.g., "RB", "AM") used everywhere internally
2. **Station name**: human-readable (e.g., "Reboleira", "Alameda")
3. **API destination ID**: numeric strings (e.g., "1", "38") from the Metro API, mapped via `DestinationToID`

### Map Rendering (`TrainMap.tsx`)

Three Konva layers (background image, station circles, train markers) with HTML div overlays on top for click/hover interactivity. Transfer stations render as concentric circles.

### Key Static Data (`src/utils/staticData.ts`)

`lines` record defines each metro line with ordered station arrays and `destinations` map (terminal ID → direction value ±1) used for determining train travel direction.
