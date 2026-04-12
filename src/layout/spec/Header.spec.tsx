import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/contexts/LineStateContext');

import { Header } from '@/layout/Header';
import { mockUseLineStates } from '@/shared/hooks/spec/mockUseLineStates';
import { Routes } from '@/shared/routes';

const renderHeader = (initialRoute = Routes.HOME) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>,
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLineStates();
  });

  it('renders the logo text', () => {
    renderHeader();
    expect(screen.getByText('Metro Lisboa')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderHeader();
    expect(screen.getByText('Mapa em Tempo Real')).toBeInTheDocument();
    expect(screen.getByText('Planeia Viagem')).toBeInTheDocument();
    expect(screen.getByText('Alertas')).toBeInTheDocument();
  });

  it('renders the logo icon with M', () => {
    renderHeader();
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    renderHeader();
    expect(screen.getByText('Mapa em Tempo Real').closest('a')).toHaveAttribute(
      'href',
      Routes.HOME,
    );
    expect(screen.getByText('Planeia Viagem').closest('a')).toHaveAttribute('href', Routes.PLANNER);
    expect(screen.getByText('Alertas').closest('a')).toHaveAttribute('href', Routes.ALERTS);
  });

  it('hamburger button has correct aria-label', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /menu de navegação/ })).toBeInTheDocument();
  });

  it('hamburger button toggles aria-expanded on click', async () => {
    renderHeader();
    const button = screen.getByRole('button', { name: /menu de navegação/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('navigation has aria-label', () => {
    renderHeader();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('shows alert dot when line has non-normal status', () => {
    mockUseLineStates({
      lineStates: [{ name: 'Azul', status: 'Perturbada', message: 'test' }],
    });
    renderHeader();
    expect(document.querySelector("[class*='alertIndicator']")).toBeInTheDocument();
  });

  it('hides alert dot when all lines are normal', () => {
    mockUseLineStates({
      lineStates: [{ name: 'Azul', status: 'Normal', message: '0' }],
    });
    renderHeader();
    expect(document.querySelector("[class*='alertIndicator']")).not.toBeInTheDocument();
  });
});
