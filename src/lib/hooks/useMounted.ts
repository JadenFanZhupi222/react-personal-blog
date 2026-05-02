import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR / first client render, true after hydration.
 * Replaces the `useState(false) + useEffect(setTrue)` SSR-mount hack
 * (which violates react-hooks/set-state-in-effect).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
