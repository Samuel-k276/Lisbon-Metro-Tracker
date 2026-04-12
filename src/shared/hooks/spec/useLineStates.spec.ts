import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/fetchLineState');

import { fetchLineStateAll } from '@/shared/api/fetchLineState';
import { LineStateProvider, useLineStates } from '@/shared/contexts/LineStateContext';
import type { LineState } from '@/shared/types/metro';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(LineStateProvider, null, children);

const mockLineStates: LineState[] = [
  { name: 'Amarela', status: 'Normal', message: '' },
  { name: 'Azul', status: 'Normal', message: '' },
  { name: 'Verde', status: 'Normal', message: '' },
  { name: 'Vermelha', status: 'Perturbada', message: 'Signal issue' },
];

describe('useLineStates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading initially', () => {
    vi.mocked(fetchLineStateAll).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useLineStates(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.lineStates).toHaveLength(4);
    expect(result.current.error).toBeNull();
  });

  it('returns line states after fetch', async () => {
    vi.mocked(fetchLineStateAll).mockResolvedValue(mockLineStates);
    const { result } = renderHook(() => useLineStates(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lineStates).toEqual(mockLineStates);
    expect(result.current.error).toBeNull();
  });

  it('returns error on fetch failure', async () => {
    vi.mocked(fetchLineStateAll).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useLineStates(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar estado das linhas');
    expect(result.current.lineStates).toHaveLength(4);
  });
});
