import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { StationMarker } from '../StationMarker';

const defaultProps = {
  cx: 100,
  cy: 200,
  lineColor: '#FF0000',
  isTransfer: false,
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
    expect(container.querySelectorAll('circle')).toHaveLength(1);
  });

  it('renders two circles for transfer station', () => {
    const { container } = renderMarker({ isTransfer: true });
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('uses line color for stroke', () => {
    const { container } = renderMarker();
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('stroke', '#FF0000');
  });
});
