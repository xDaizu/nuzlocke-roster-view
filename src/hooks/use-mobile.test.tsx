import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalInnerWidth;
  });

  it('returns true if window.innerWidth is less than MOBILE_BREAKPOINT', () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false if window.innerWidth is greater than or equal to MOBILE_BREAKPOINT', () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('updates when the window size changes', () => {
    let changeHandler: (() => void) | undefined;
    window.matchMedia = vi.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        addEventListener: (event: string, handler: () => void) => {
          if (event === 'change') changeHandler = handler;
        },
        removeEventListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn(),
      };
    });
    window.innerWidth = 900;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    // Simulate resize
    window.innerWidth = 500;
    act(() => {
      changeHandler && changeHandler();
    });
    expect(result.current).toBe(true);
  });
}); 