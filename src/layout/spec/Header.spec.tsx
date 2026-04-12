import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('hamburger button has correct aria-label', () => {
    renderHeader();
    expect(
      screen.getByRole('button', { name: 'Abrir/fechar menu de navegação' }),
    ).toBeInTheDocument();
  });

  it('hamburger button toggles aria-expanded on click', async () => {
    const user = userEvent.setup();
    renderHeader();
    const button = screen.getByRole('button', { name: 'Abrir/fechar menu de navegação' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('navigation has aria-label', () => {
    renderHeader();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });
});
