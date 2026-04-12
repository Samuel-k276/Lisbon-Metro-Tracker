import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/hooks/useTrain');

import { TrainDetail } from '@/features/trains/TrainDetail';
import { mockUseTrain } from '@/shared/hooks/spec/mockUseTrain';

const renderWithRoute = (trainId: string) => {
  render(
    <MemoryRouter initialEntries={[`/train/${trainId}`]}>
      <Routes>
        <Route path='/train/:trainId' element={<TrainDetail />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('TrainDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTrain();
  });

  it('shows loading spinner', () => {
    mockUseTrain({ train: null, trainInfo: null, loading: true });
    renderWithRoute('ML001A');
    expect(document.querySelector("[class*='spinner']")).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseTrain({ train: null, trainInfo: null, error: 'Train ML001A not found' });
    renderWithRoute('ML001A');
    expect(screen.getByText('Train ML001A not found')).toBeInTheDocument();
  });

  it('shows unavailable when no train info', () => {
    mockUseTrain({ train: null, trainInfo: null });
    renderWithRoute('ML001A');
    expect(screen.getByText('Train information not available')).toBeInTheDocument();
  });

  it('renders train details', () => {
    renderWithRoute('ML001A');
    expect(screen.getByText('Train ML001A')).toBeInTheDocument();
    expect(screen.getAllByText('Azul').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Santa Apolónia').length).toBeGreaterThanOrEqual(1);
  });

  it('renders station list with next station badge', () => {
    renderWithRoute('ML001A');
    expect(screen.getByText('São Sebastião')).toBeInTheDocument();
    expect(screen.getByText('Parque')).toBeInTheDocument();
    expect(screen.getByText('Next station')).toBeInTheDocument();
  });

  it('renders line information section', () => {
    renderWithRoute('ML001A');
    expect(screen.getByText('Line Information')).toBeInTheDocument();
    expect(screen.getByText('Terminals:')).toBeInTheDocument();
  });
});
