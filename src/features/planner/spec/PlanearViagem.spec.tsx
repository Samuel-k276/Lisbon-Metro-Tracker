import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlanearViagem } from '@/features/planner/PlanearViagem';

describe('PlanearViagem', () => {
  it('renders the page title and description', () => {
    render(<PlanearViagem />);
    expect(screen.getByText('Planear Viagem')).toBeInTheDocument();
    expect(screen.getByText(/calcular a melhor rota/)).toBeInTheDocument();
  });

  it('renders origin and destination selects', () => {
    render(<PlanearViagem />);
    expect(screen.getByLabelText('Estação de Origem')).toBeInTheDocument();
    expect(screen.getByLabelText('Estação de Destino')).toBeInTheDocument();
  });

  it('renders the calculate button', () => {
    render(<PlanearViagem />);
    expect(screen.getByText('Calcular Rota')).toBeInTheDocument();
  });

  it('shows alert when calculating without selection', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<PlanearViagem />);

    await userEvent.click(screen.getByText('Calcular Rota'));
    expect(alertSpy).toHaveBeenCalledWith('Por favor, selecione a origem e o destino');

    alertSpy.mockRestore();
  });

  it('does not show results initially', () => {
    render(<PlanearViagem />);
    expect(screen.queryByText('Resultado')).not.toBeInTheDocument();
  });

  it('calculates and displays route results', async () => {
    render(<PlanearViagem />);

    await userEvent.selectOptions(screen.getByLabelText('Estação de Origem'), 'RB');
    await userEvent.selectOptions(screen.getByLabelText('Estação de Destino'), 'SA');
    await userEvent.click(screen.getByText('Calcular Rota'));

    expect(screen.getByText('Resultado')).toBeInTheDocument();
    expect(screen.getByText('Tempo Total')).toBeInTheDocument();
    expect(screen.getByText('Estações')).toBeInTheDocument();
    expect(screen.getByText('Itinerário Detalhado')).toBeInTheDocument();
  });

  it('swaps origin and destination', async () => {
    render(<PlanearViagem />);

    const origemSelect = screen.getByLabelText('Estação de Origem') as HTMLSelectElement;
    const destinoSelect = screen.getByLabelText('Estação de Destino') as HTMLSelectElement;

    await userEvent.selectOptions(origemSelect, 'RB');
    await userEvent.selectOptions(destinoSelect, 'SA');

    expect(origemSelect.value).toBe('RB');
    expect(destinoSelect.value).toBe('SA');

    await userEvent.click(screen.getByText('⇅'));

    expect(origemSelect.value).toBe('SA');
    expect(destinoSelect.value).toBe('RB');
  });

  it('shows note about conceptual planner', async () => {
    render(<PlanearViagem />);

    await userEvent.selectOptions(screen.getByLabelText('Estação de Origem'), 'RB');
    await userEvent.selectOptions(screen.getByLabelText('Estação de Destino'), 'AS');
    await userEvent.click(screen.getByText('Calcular Rota'));

    expect(screen.getByText(/planeador conceptual/)).toBeInTheDocument();
  });
});
