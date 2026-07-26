import { describe, expect, it, vi } from 'vitest';

vi.mock('gsap', () => ({
  default: {
    registerPlugin: () => undefined,
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('@gsap/react', () => ({
  useGSAP: () => undefined,
}));

import { projectTrackXPercent } from './ProjectsScene';

describe('projectTrackXPercent', () => {
  it.each([
    [1, 0],
    [2, -50],
    [3, (-200 / 3)],
  ])('returns the track-relative offset for %i panels', (panels, expected) => {
    expect(projectTrackXPercent(panels)).toBeCloseTo(expected);
  });
});
