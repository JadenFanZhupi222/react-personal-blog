import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const welcomeSource = readFileSync(join(process.cwd(), 'src/components/welcome/index.tsx'), 'utf8');
const shaderSource = readFileSync(
  join(process.cwd(), 'src/components/welcome/AmbientShader.tsx'),
  'utf8'
);

describe('welcome theme styling', () => {
  it('uses theme-aware surfaces and text instead of fixed dark styling', () => {
    expect(welcomeSource).toContain('bg-background');
    expect(welcomeSource).toContain('text-foreground');
    expect(welcomeSource).not.toContain('bg-[#0a0a0f]');
    expect(welcomeSource).not.toContain('text-white');
  });

  it('derives the ambient shader palette from the active theme', () => {
    expect(shaderSource).toContain('useTheme');
    expect(shaderSource).toContain('resolvedTheme');
    expect(shaderSource).not.toContain("const base = '#0a0a0f'");
  });
});
