import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/hooks/useStation');

import { StationDetail } from '@/features/stations/StationDetail';
import { mockUseStation, defaultStation } from '@/shared/hooks/spec/mockUseStation';

const renderWithRoute = (stationId: string) => {
  render(
    <MemoryRouter initialEntries={[`/station/${stationId}`]}>
      <Routes>
        <Route path='/station/:stationId' element={<StationDetail />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('StationDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStation();
  });

  it('shows loading spinner', () => {
    mockUseStation({ station: null, loading: true });
    renderWithRoute('AM');
    expect(document.querySelector("[class*='spinner']")).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseStation({ station: null, error: 'Connection failed' });
    renderWithRoute('AM');
    expect(screen.getByText(/Connection failed/)).toBeInTheDocument();
  });

  it('shows station not found', () => {
    mockUseStation({ station: null });
    renderWithRoute('AM');
    expect(screen.getByText('Estação não encontrada')).toBeInTheDocument();
  });

  it('renders station name and info', () => {
    renderWithRoute('AM');
    expect(screen.getByRole('heading', { name: /Alameda/ })).toBeInTheDocument();
    expect(screen.getByText(/Verde, Vermelha/)).toBeInTheDocument();
  });

  it('renders destination chips', () => {
    renderWithRoute('AM');
    expect(screen.getAllByText('Telheiras').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cais do Sodré').length).toBeGreaterThanOrEqual(1);
  });

  it('renders next trains table', () => {
    renderWithRoute('AM');
    expect(screen.getByText('Destino')).toBeInTheDocument();
    expect(screen.getByText('Tempo 1')).toBeInTheDocument();
    expect(screen.getByText('2m 0s')).toBeInTheDocument();
  });

  it('shows no upcoming trains when empty', () => {
    mockUseStation({ station: { ...defaultStation, nextTrains: [] } });
    renderWithRoute('AM');
    expect(screen.getByText('Sem comboios previstos')).toBeInTheDocument();
  });
});
