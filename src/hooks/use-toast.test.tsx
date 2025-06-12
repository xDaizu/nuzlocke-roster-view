import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { useToast, toast } from './use-toast';

describe('useToast', () => {
  afterEach(() => {
    // Clear all toasts after each test
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
  });

  it('should add a toast and update state', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Test Toast', description: 'Hello' });
    });
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('Hello');
  });

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string | undefined;
    act(() => {
      const t = result.current.toast({ title: 'Dismiss Me' });
      toastId = t.id;
    });
    expect(result.current.toasts.length).toBe(1);
    act(() => {
      result.current.dismiss(toastId);
    });
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should remove a toast after dismiss and timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());
    let toastId: string | undefined;
    act(() => {
      const t = result.current.toast({ title: 'Remove Me' });
      toastId = t.id;
      result.current.dismiss(toastId);
    });
    // Fast-forward timers
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(result.current.toasts.length).toBe(0);
    vi.useRealTimers();
  });
}); 