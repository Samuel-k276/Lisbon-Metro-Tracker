import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { Header } from '@/layout/Header';
import { Routes } from '@/shared/routes';

const renderHeader = (initialRoute = Routes.HOME) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>,
  );
};

describe('Header', () => {
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
});
