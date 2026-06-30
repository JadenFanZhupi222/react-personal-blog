import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { HeroScene } from './HeroScene';

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

vi.mock('@/lib/hooks/useTranslations', () => ({
  useTranslations: () => ({
    locale: 'en',
    t: {
      welcome: {
        name: 'Shijie Fan',
        nickname: 'Zhupi222',
        role: {
          fullstack: 'Full-stack Developer',
          tech: 'Tech Enthusiast',
          game: 'Gamer',
        },
        enter: 'Enter',
      },
    },
  }),
}));

vi.mock('../lib/useReducedMotion', () => ({
  useReducedMotion: () => true,
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({ from: vi.fn().mockReturnThis() })),
    to: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

describe('HeroScene welcome effects', () => {
  test('renders welcome-only ambient effects and an enhanced entry link', () => {
    mockMatchMedia(false);
    const { container } = render(<HeroScene />);

    expect(container.querySelector('[data-effect="welcome-orbit"]')).toBeInTheDocument();
    expect(container.querySelector('[data-effect="welcome-scanline"]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Enter' })).toHaveClass('welcome-entry-cta');
  });
});
