import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { TrainMarker } from '../TrainMarker';

const defaultProps = {
  cx: 100,
  cy: 200,
  angle: 0,
  label: 'T001',
  isHovered: false,
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

  it('uses correct radius when not hovered', () => {
    const { container } = renderMarker({ isHovered: false });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('r', '10');
  });

  it('uses correct radius when hovered', () => {
    const { container } = renderMarker({ isHovered: true });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('r', '12');
  });

  it('uses correct shadow filter when not hovered', () => {
    const { container } = renderMarker({ isHovered: false });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('filter', 'url(#train-shadow)');
  });

  it('uses correct shadow filter when hovered', () => {
    const { container } = renderMarker({ isHovered: true });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('filter', 'url(#train-shadow-hover)');
  });
});
