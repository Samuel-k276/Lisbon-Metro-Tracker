import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/hooks/useLineStates');

import { Alerts } from '@/features/alerts/Alerts';
import { mockUseLineStates } from '@/shared/hooks/spec/mockUseLineStates';

describe('Alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLineStates();
  });

  it('shows loading spinner', () => {
    mockUseLineStates({ lineStates: [], loading: true });
    render(<Alerts />);
    expect(document.querySelector("[class*='spinner']")).toBeInTheDocument();
  });

  it('renders all line cards', () => {
    render(<Alerts />);
    expect(screen.getByText('Azul')).toBeInTheDocument();
    expect(screen.getByText('Amarela')).toBeInTheDocument();
    expect(screen.getByText('Verde')).toBeInTheDocument();
    expect(screen.getByText('Vermelha')).toBeInTheDocument();
  });

  it('shows status for each line', () => {
    render(<Alerts />);
    expect(screen.getAllByText(/Normal/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/Conditioned/)).toBeInTheDocument();
  });

  it('shows message when present', () => {
    render(<Alerts />);
    expect(screen.getByText('Works between Cais do Sodré and Arroios')).toBeInTheDocument();
  });

  it('does not show message when value is 0', () => {
    mockUseLineStates({
      lineStates: [{ name: 'Azul', status: 'Normal', message: '0' }],
    });
    render(<Alerts />);
    expect(screen.getByText('Azul')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseLineStates({ lineStates: [], error: 'Erro ao carregar estado das linhas' });
    render(<Alerts />);
    expect(screen.getByText('Erro ao carregar estado das linhas')).toBeInTheDocument();
  });

  it('renders the page title', () => {
    render(<Alerts />);
    expect(screen.getByText('Estado das Linhas')).toBeInTheDocument();
  });
});
