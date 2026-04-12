import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { StationMarker } from '../StationMarker';

const defaultProps = {
  cx: 100,
  cy: 200,
  lineColor: '#FF0000',
  isTransfer: false,
  isHovered: false,
  hoverColor: '#2196F3',
};

const renderMarker = (overrides = {}) => {
  return render(
    <svg>
      <StationMarker {...defaultProps} {...overrides} />
    </svg>,
  );
};

describe('StationMarker', () => {
  it('renders a single circle for non-transfer station', () => {
    const { container } = renderMarker({ isTransfer: false });
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(1);
  });

  it('renders two circles for transfer station', () => {
    const { container } = renderMarker({ isTransfer: true });
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });

  it('uses hover color when isHovered is true', () => {
    const { container } = renderMarker({ isHovered: true });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('stroke', '#2196F3');
  });

  it('uses line color when not hovered', () => {
    const { container } = renderMarker({ isHovered: false });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('stroke', '#FF0000');
  });

  it('uses correct shadow filter when hovered', () => {
    const { container } = renderMarker({ isHovered: true });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('filter', 'url(#station-shadow-hover)');
  });

  it('uses correct shadow filter when not hovered', () => {
    const { container } = renderMarker({ isHovered: false });
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('filter', 'url(#station-shadow)');
  });
});
