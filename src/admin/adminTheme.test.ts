import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(path.resolve(process.cwd(), 'src/admin/admin.css'), 'utf8');

describe('Payload admin theme contract', () => {
  it('defines both themes, focus, responsive, and reduced-motion behavior', () => {
    expect(css).toContain("[data-theme='dark']");
    expect(css).toContain("[data-theme='light']");
    expect(css).toContain(':focus-visible');
    expect(css).toContain('@media (max-width: 900px)');
    expect(css).toContain('@media (max-width: 520px)');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('refines stable Payload controls and content surfaces', () => {
    expect(css).toContain('.btn');
    expect(css).toContain('.field-type');
    expect(css).toContain('.table');
    expect(css).toContain('.drawer');
    expect(css).toContain('.modal');
  });

  it('avoids brittle DOM-depth and positional selectors', () => {
    expect(css).not.toMatch(/:nth-child|body\s*>\s*div\s*>/);
  });
});
