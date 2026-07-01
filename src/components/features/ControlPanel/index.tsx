'use client';
import { LanguageSwitch } from './LanguageSwitch';
import ThemeSwitch from './ThemeSwitch';

export function ControlPanel() {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border/70 bg-card-30 p-2 shadow-sm backdrop-blur">
      <LanguageSwitch />
      <ThemeSwitch />
    </div>
  );
}
