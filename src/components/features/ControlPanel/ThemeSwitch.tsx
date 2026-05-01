import React, { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const emptySubscribe = () => () => {};

const ThemeSwitch = () => {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-primary-foreground hover:bg-primary-hover/30 inline-flex items-center justify-center rounded-md p-1.5"
      aria-label="Toggle theme"
    >
      {mounted ? isDark ? <Sun size={20} /> : <Moon size={20} /> : null}
    </button>
  );
};

export default ThemeSwitch;
