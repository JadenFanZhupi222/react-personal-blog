import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContactData } from '@/lib/contact/types';
import { ContactScene } from './ContactScene';

const { fromTo } = vi.hoisted(() => ({
  fromTo: vi.fn(),
}));

vi.mock('@gsap/react', () => ({
  useGSAP: () => undefined,
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: () => undefined,
    fromTo,
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('../lib/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

vi.mock('@/lib/hooks/useTranslations', () => ({
  useTranslations: () => ({
    t: {
      welcome: {
        contact: {
          title: 'Contact',
          description: 'GitHub / Email',
          platforms: ['GitHub', 'Email'],
          copied: 'Copied',
        },
      },
    },
  }),
}));

const contact: ContactData = {
  github: {
    label: 'GitHub',
    username: 'JadenFanZhupi222',
    link: 'https://github.com/JadenFanZhupi222',
  },
  emails: [
    {
      label: 'Email',
      value: 'zhupi222.fan@gmail.com',
      iconKey: 'gmail',
    },
  ],
  socials: [],
};

describe('ContactScene', () => {
  beforeEach(() => {
    fromTo.mockClear();
  });

  it('renders the CMS-backed GitHub link and an email copy button without a subtitle', () => {
    render(<ContactScene contact={contact} />);

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/JadenFanZhupi222'
    );
    expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument();
    expect(screen.queryByText('GitHub / Email')).not.toBeInTheDocument();
    expect(screen.queryByText('WeChat')).not.toBeInTheDocument();
    expect(screen.queryByText('微信')).not.toBeInTheDocument();
  });

  it('copies the email and animates localized success feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<ContactScene contact={contact} />);

    fireEvent.click(screen.getByRole('button', { name: 'Email' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('zhupi222.fan@gmail.com');
      expect(screen.getByRole('button', { name: /Copied/ })).toBeInTheDocument();
      expect(fromTo).toHaveBeenCalled();
    });
  });

  it('does not show success feedback when clipboard access fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')) },
    });
    render(<ContactScene contact={contact} />);

    fireEvent.click(screen.getByRole('button', { name: 'Email' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument();
    });
    expect(screen.queryByText('Copied')).not.toBeInTheDocument();
    expect(fromTo).not.toHaveBeenCalled();
  });

  it('keeps contact links visible instead of hiding them behind a scroll animation', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/components/welcome/scenes/ContactScene.tsx'),
      'utf8'
    );

    expect(source).not.toContain('const buttons =');
    expect(source).not.toContain('.from(\\n          buttons');
  });
});
