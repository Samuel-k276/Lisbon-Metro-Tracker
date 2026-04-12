import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { TrainMarker } from '../TrainMarker';

const defaultProps = {
  cx: 100,
  cy: 200,
  angle: 0,
  label: 'T001',
};

const renderMarker = (overrides = {}) => {
  return render(
    <svg>
      <TrainMarker {...defaultProps} {...overrides} />
    </svg>,
  );
};

describe('TrainMarker', () => {
  it('renders a circle, polygon, line, and text', () => {
    const { container } = renderMarker();
    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(container.querySelector('polygon')).toBeInTheDocument();
    expect(container.querySelector('line')).toBeInTheDocument();
    expect(container.querySelector('text')).toBeInTheDocument();
  });

  it('shows the label text', () => {
    renderMarker({ label: 'AB12' });
    expect(screen.getByText('AB12')).toBeInTheDocument();
  });

  it('has fixed radius of 10', () => {
    const { container } = renderMarker();
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('r', '10');
  });

  it('does not have shadow filter', () => {
    const { container } = renderMarker();
    const circle = container.querySelector('circle');
    expect(circle).not.toHaveAttribute('filter');
  });
});
