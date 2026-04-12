import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useNavigateTo } from '@/shared/hooks/useNavigateTo';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(MemoryRouter, null, children);

describe('useNavigateTo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  it('calls navigate and scrollTo', () => {
    const { result } = renderHook(() => useNavigateTo(), { wrapper });

    act(() => {
      result.current('/station/AM');
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(mockNavigate).toHaveBeenCalledWith('/station/AM');
  });
});
