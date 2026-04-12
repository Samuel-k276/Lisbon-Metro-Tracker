import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';

import { NotFound } from '@/shared/components/NotFound';
import { Routes } from '@/shared/routes';

describe('NotFound', () => {
  it('renders 404 page', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
  });

  it('has a link back to home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByText('Voltar ao mapa').closest('a')).toHaveAttribute('href', Routes.HOME);
  });
});
