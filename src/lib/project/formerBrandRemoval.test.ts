import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('former brand removal', () => {
  it('keeps restricted brand references out of the tracked source tree', () => {
    const restrictedRoot = ['zo', 'da'].join('');
    const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    })
      .split('\0')
      .filter(Boolean)
      .filter((file) => !file.endsWith('formerBrandRemoval.test.ts'));

    const matches = trackedFiles.filter((file) => {
      const content = readFileSync(join(process.cwd(), file), 'utf8');
      return content.toLowerCase().includes(restrictedRoot);
    });

    expect(matches).toEqual([]);
  });
});
