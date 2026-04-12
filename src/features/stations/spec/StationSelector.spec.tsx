import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StationSelector } from '@/features/stations/StationSelector';
import type { Station } from '@/shared/types/metro';

const mockStations: Station[] = [
  {
    id: 'AM',
    name: 'Alameda',
    coordinates: { x: -9.13409, y: 38.7373 },
    lines: ['Verde', 'Vermelha'],
    isTransfer: true,
    isTerminal: false,
    nextTrains: [],
  },
  {
    id: 'BX',
    name: 'Baixa-Chiado',
    coordinates: { x: -9.14, y: 38.71 },
    lines: ['Azul', 'Verde'],
    isTransfer: true,
    isTerminal: false,
    nextTrains: [],
  },
];

describe('StationSelector', () => {
  const onSelectStation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders station list', () => {
    render(<StationSelector stations={mockStations} onSelectStation={onSelectStation} />);
    expect(screen.getByText('Alameda')).toBeInTheDocument();
    expect(screen.getByText('Baixa-Chiado')).toBeInTheDocument();
  });

  it('shows "No stations available" when empty', () => {
    render(<StationSelector stations={[]} onSelectStation={onSelectStation} />);
    expect(screen.getByText('No stations available')).toBeInTheDocument();
  });

  it('clicking a station calls onSelectStation', async () => {
    const user = userEvent.setup();
    render(<StationSelector stations={mockStations} onSelectStation={onSelectStation} />);

    await user.click(screen.getByText('Alameda'));
    expect(onSelectStation).toHaveBeenCalledWith(mockStations[0]);
  });

  it('selected station gets highlighted class', async () => {
    const user = userEvent.setup();
    render(<StationSelector stations={mockStations} onSelectStation={onSelectStation} />);

    const alamedaEl = screen.getByText('Alameda');
    await user.click(alamedaEl);

    expect(alamedaEl.className).toContain('selected');
  });
});
