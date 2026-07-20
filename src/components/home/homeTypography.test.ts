import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const homeSource = readFileSync(join(process.cwd(), 'src/components/home/index.tsx'), 'utf8');

describe('home typography', () => {
  it('keeps the Chinese-friendly hero scale below the oversized 8xl treatment', () => {
    expect(homeSource).toContain('text-4xl');
    expect(homeSource).toContain('sm:text-5xl');
    expect(homeSource).toContain('lg:text-6xl');
    expect(homeSource).toContain('xl:text-7xl');
    expect(homeSource).not.toContain('xl:text-8xl');
  });
});
