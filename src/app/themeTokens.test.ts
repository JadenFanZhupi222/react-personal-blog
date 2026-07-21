import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const globalsCss = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

function cssBlock(selector: string) {
  const start = globalsCss.indexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  const nextThemeStart = selector === ':root' ? globalsCss.indexOf('  .dark {', start) : -1;

  if (nextThemeStart > start) {
    return globalsCss.slice(start, nextThemeStart);
  }

  let depth = 0;
  const openingBrace = globalsCss.indexOf('{', start);
  for (let i = openingBrace; i < globalsCss.length; i++) {
    if (globalsCss[i] === '{') depth++;
    if (globalsCss[i] === '}') depth--;
    if (depth === 0 && i > start) {
      return globalsCss.slice(start, i + 1);
    }
  }

  throw new Error(`Could not find CSS block for ${selector}`);
}

function oklchLightness(block: string, property: string) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`${escapedProperty}:\\s*oklch\\((\\d*\\.?\\d+)`));
  expect(match).not.toBeNull();
  return Number(match?.[1]);
}

describe('theme tokens', () => {
  it('uses a genuinely light design background for the light theme', () => {
    const root = cssBlock(':root');

    expect(oklchLightness(root, '--design-background')).toBeGreaterThan(0.9);
  });

  it('defines a theme-aware global scrollbar treatment', () => {
    expect(globalsCss).toContain('scrollbar-color:');
    expect(globalsCss).toContain('::-webkit-scrollbar');
    expect(globalsCss).toContain('::-webkit-scrollbar-thumb');
    expect(globalsCss).toContain('var(--scrollbar-thumb)');
    expect(globalsCss).toContain('var(--scrollbar-track)');
  });

  it('uses the warm yellow editorial palette in both themes', () => {
    const root = cssBlock(':root');
    const dark = cssBlock('.dark');

    expect(root).toContain('--primary: oklch(0.82 0.17 88)');
    expect(root).toContain('--background: oklch(0.955 0.012 88)');
    expect(dark).toContain('--background: oklch(0.105 0.008 85)');
    expect(globalsCss).toContain('.editorial-panel');
  });
});
