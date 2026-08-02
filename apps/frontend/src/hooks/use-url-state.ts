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

  const setParams = (next: URLSearchParams) => {
    const query = next.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return [new URLSearchParams(search), setParams];
}
