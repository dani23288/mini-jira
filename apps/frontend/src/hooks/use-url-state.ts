import { useMemo, useSyncExternalStore } from 'react';

type ParamsUpdate = URLSearchParams | ((prev: URLSearchParams) => URLSearchParams);

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

function getSnapshot(): string {
  return window.location.search;
}

export function useUrlState(): [URLSearchParams, (next: ParamsUpdate) => void] {
  const search = useSyncExternalStore(subscribe, getSnapshot);
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setParams = (next: ParamsUpdate) => {
    // read the live URL, not the render-time `search` closure, so two calls in one handler don't clobber each other
    const resolved = typeof next === 'function' ? next(new URLSearchParams(window.location.search)) : next;
    const query = resolved.toString();
    window.history.replaceState(null, '', (query ? `?${query}` : window.location.pathname) + window.location.hash);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return [params, setParams];
}
