import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { WelcomeBackdrop } from './WelcomeBackdrop';

vi.mock('./lib/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('WelcomeBackdrop', () => {
  test('renders animated background layers for the welcome page', () => {
    const { container } = render(<WelcomeBackdrop />);

    expect(container.querySelector('[data-effect="welcome-circuit-grid"]')).toBeInTheDocument();
    expect(container.querySelector('[data-effect="welcome-code-rain"]')).toBeInTheDocument();
    expect(container.querySelector('[data-effect="welcome-beam-field"]')).toBeInTheDocument();
  });
});
