import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const appDir = path.resolve(process.cwd(), 'src/app');

describe('root layout architecture', () => {
  it('keeps frontend and Payload as independent root layouts', () => {
    expect(fs.existsSync(path.join(appDir, 'layout.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(appDir, '(frontend)', 'layout.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, '(payload)', 'layout.tsx'))).toBe(true);
  });
});
