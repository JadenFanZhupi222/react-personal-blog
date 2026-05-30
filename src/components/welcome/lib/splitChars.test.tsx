import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { splitChars } from './splitChars';

describe('splitChars', () => {
  it('wraps each non-space character in a span', () => {
    const { container } = render(<>{splitChars('abc')}</>);
    const spans = container.querySelectorAll('span[data-char]');
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe('a');
    expect(spans[2].textContent).toBe('c');
  });

  it('preserves spaces as non-breaking', () => {
    const { container } = render(<>{splitChars('a b')}</>);
    const spans = container.querySelectorAll('span[data-char]');
    expect(spans).toHaveLength(3);
    expect(spans[1].textContent).toBe(' ');
  });

  it('marks every span with inline-block for GSAP transform safety', () => {
    const { container } = render(<>{splitChars('hi')}</>);
    const span = container.querySelector('span[data-char]') as HTMLElement;
    expect(span.style.display).toBe('inline-block');
  });
});
