import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AchievementGlow } from './AchievementGlow';
import { CodeScanline } from './CodeScanline';
import { GridAura } from './GridAura';
import { ReactBitsEffects } from './ReactBitsEffects';
import { TextReveal } from './TextReveal';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('React Bits inspired effects', () => {
  test('TextReveal renders readable text by default', () => {
    mockMatchMedia(false);
    render(<TextReveal text="Welcome home" />);

    expect(screen.getByText('Welcome home')).toBeInTheDocument();
  });

  test('GridAura is aria-hidden ambience', () => {
    mockMatchMedia(false);
    const { container } = render(<GridAura />);

    const aura = container.querySelector('[data-effect="grid-aura"]');
    expect(aura).toHaveAttribute('aria-hidden', 'true');
  });

  test('ReactBitsEffects renders no ambience on article detail pages', () => {
    mockMatchMedia(false);
    const { container } = render(<ReactBitsEffects pathname="/en/blog/post-1" />);

    expect(container.querySelector('[data-effect="grid-aura"]')).not.toBeInTheDocument();
  });

  test('AchievementGlow marks rare achieved achievements', () => {
    render(
      <AchievementGlow rare achieved>
        <div>Rare unlock</div>
      </AchievementGlow>
    );

    expect(screen.getByText('Rare unlock').parentElement).toHaveAttribute('data-rare', 'true');
  });

  test('CodeScanline keeps code content visible', () => {
    render(
      <CodeScanline>
        <pre>const value = 1;</pre>
      </CodeScanline>
    );

    expect(screen.getByText('const value = 1;')).toBeInTheDocument();
  });
});
