import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useUrlState } from '../use-url-state';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('useUrlState', () => {
  it('reflects the current URL search params on mount', () => {
    window.history.replaceState(null, '', '/?view=list');
    const { result } = renderHook(() => useUrlState());

    expect(result.current[0].get('view')).toBe('list');
  });

  it('writes params to the URL when set', () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current[1](new URLSearchParams({ view: 'list', sort: 'priority' }));
    });

    expect(window.location.search).toBe('?view=list&sort=priority');
    expect(result.current[0].get('sort')).toBe('priority');
  });

  it('clears the query string when set to empty params', () => {
    window.history.replaceState(null, '', '/?view=list');
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current[1](new URLSearchParams());
    });

    expect(window.location.search).toBe('');
  });

  it('re-reads state when a popstate event fires', () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      window.history.replaceState(null, '', '/?view=board');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current[0].get('view')).toBe('board');
  });
});
