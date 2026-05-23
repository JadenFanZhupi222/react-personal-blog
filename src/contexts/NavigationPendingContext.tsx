'use client';

import { createContext, useCallback, useContext, useState } from 'react';

/**
 * Tracks how many PendingLinks are currently mid-navigation so a single
 * global indicator (TopProgressBar) can show whenever ANY link is pending.
 * Uses a counter rather than a boolean to handle the rare case of two
 * navigations overlapping (user clicks a second link before the first
 * resolves).
 */
interface NavigationPendingValue {
  pending: boolean;
  report: (isPending: boolean) => void;
}

const NavigationPendingContext = createContext<NavigationPendingValue | null>(null);

export function NavigationPendingProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const report = useCallback((isPending: boolean) => {
    setCount((c) => Math.max(0, c + (isPending ? 1 : -1)));
  }, []);
  return (
    <NavigationPendingContext.Provider value={{ pending: count > 0, report }}>
      {children}
    </NavigationPendingContext.Provider>
  );
}

export function useNavigationPending(): NavigationPendingValue | null {
  return useContext(NavigationPendingContext);
}
