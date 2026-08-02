import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

function getSnapshot(): string {
  return window.location.search;
}

export function useUrlState(): [URLSearchParams, (next: URLSearchParams) => void] {
  const search = useSyncExternalStore(subscribe, getSnapshot);

  // risk: no functional-updater form — two setParams calls off the same stale params in one handler silently drop the first change
  const setParams = (next: URLSearchParams) => {
    const query = next.toString();
    // nit: drops window.location.hash on every call, fine only while nothing uses hash routing
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // risk: new URLSearchParams(search) is a fresh ref every render, breaks memoized deps/query vars downstream
  return [new URLSearchParams(search), setParams];
}
