import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Spinner } from '@/shared/components/Spinner';

describe('Spinner', () => {
  it('renders the spinner div', () => {
    const { container } = render(<Spinner />);
    const spinnerDiv = container.querySelector('div');
    expect(spinnerDiv).toBeInTheDocument();
  });
});
