import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TrainMap } from '../TrainMap';

vi.mock('@/shared/contexts/TrainContext');
vi.mock('@/shared/hooks/useNavigateTo', () => ({
  useNavigateTo: () => vi.fn(),
}));

import { useTrains } from '@/shared/contexts/TrainContext';

const mockedUseTrains = vi.mocked(useTrains);

const renderTrainMap = () => {
  return render(
    <MemoryRouter>
      <TrainMap />
    </MemoryRouter>,
  );
};

describe('TrainMap', () => {
  beforeEach(() => {
    mockedUseTrains.mockReturnValue({
      trainData: null,
      trainPositions: [],
      loading: false,
      error: null,
      lastUpdated: null,
    });
  });

  it('renders the SVG element with correct aria-label', () => {
    renderTrainMap();
    expect(
      screen.getByRole('img', {
        name: 'Mapa do Metro de Lisboa com posições dos comboios em tempo real',
      }),
    ).toBeInTheDocument();
  });

  it('renders station markers with aria-labels containing Estação', () => {
    renderTrainMap();
    const stations = screen.getAllByLabelText(/Estação/);
    expect(stations.length).toBeGreaterThan(0);
  });

  it('renders error banner when error present', () => {
    mockedUseTrains.mockReturnValue({
      trainData: null,
      trainPositions: [],
      loading: false,
      error: 'Falha ao carregar dados dos comboios',
      lastUpdated: null,
    });

    renderTrainMap();
    expect(screen.getByText('Falha ao carregar dados dos comboios')).toBeInTheDocument();
  });

  it('renders train markers when trainPositions provided', () => {
    mockedUseTrains.mockReturnValue({
      trainData: null,
      trainPositions: [
        {
          id: 'T001-test',
          line: 'Azul',
          position: { x: 100, y: 200 },
          angle: 0,
          destination: 'SC',
          waitingTime: 60,
          nextStationId: 'AV',
        },
      ],
      loading: false,
      error: null,
      lastUpdated: null,
    });

    renderTrainMap();
    expect(screen.getByLabelText('Comboio T001-test')).toBeInTheDocument();
  });
});
