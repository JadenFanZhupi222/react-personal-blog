import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMounted } from '@/lib/hooks/useMounted';

const ThemeSwitch = () => {
  const mounted = useMounted();
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card-30 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-accent hover:text-primary active:scale-95 active:duration-75"
      aria-label="Toggle theme"
    >
      {mounted ? isDark ? <Sun size={20} /> : <Moon size={20} /> : null}
    </button>
  );
};

export default ThemeSwitch;
