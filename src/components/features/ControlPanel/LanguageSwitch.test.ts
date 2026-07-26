import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const languageSwitchSource = readFileSync(
  join(process.cwd(), 'src/components/features/ControlPanel/LanguageSwitch.tsx'),
  'utf8'
);

describe('LanguageSwitch', () => {
  it('opens as a non-modal menu so the page scrollbar stays visible', () => {
    expect(languageSwitchSource).toContain('<DropdownMenu modal={false}>');
  });

  it('uses a full navigation for localized routes so prefetched CMS data is not reused', () => {
    expect(languageSwitchSource).toContain('window.location.assign');
    expect(languageSwitchSource).not.toContain('router.push');
  });
});
