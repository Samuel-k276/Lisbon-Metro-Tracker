import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Footer } from '@/layout/Footer';

describe('Footer', () => {
  it('renders GitHub link', () => {
    render(<Footer />);
    const link = screen.getByText('GitHub');
    expect(link).toHaveAttribute('href', 'https://github.com/Samuel-k276/Lisbon-Metro-Tracker');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders the disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText(/Não afiliado oficialmente/)).toBeInTheDocument();
  });
});
