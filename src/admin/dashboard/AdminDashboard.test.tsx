import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminLogo } from '@/admin/branding/AdminLogo';
import { DashboardMetric } from './DashboardMetric';
import { QuickCreate } from './QuickCreate';
import { RecentContent } from './RecentContent';

describe('Payload admin dashboard components', () => {
  it('renders an accessible brand lockup', () => {
    render(<AdminLogo />);

    expect(screen.getByText('Zhupi CMS')).toBeInTheDocument();
    expect(screen.getByText('Personal workspace')).toBeInTheDocument();
  });

  it('links metrics to their source collection and handles unavailable values', () => {
    const { rerender } = render(
      <DashboardMetric href="/admin/collections/cms-posts" label="Posts" value={18} />,
    );

    expect(screen.getByRole('link', { name: /Posts/i })).toHaveAttribute(
      'href',
      '/admin/collections/cms-posts',
    );
    expect(screen.getByText('18')).toBeInTheDocument();

    rerender(
      <DashboardMetric href="/admin/collections/cms-posts" label="Posts" value={null} />,
    );
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('renders recent document and quick-create destinations', () => {
    render(
      <>
        <RecentContent
          items={[
            {
              id: 'post-1',
              title: 'Calmer frontend',
              type: 'Post',
              collection: 'cms-posts',
              status: 'draft',
              updatedAt: '2026-07-26T10:00:00Z',
            },
          ]}
        />
        <QuickCreate />
      </>,
    );

    expect(screen.getByRole('link', { name: /Calmer frontend/i })).toHaveAttribute(
      'href',
      '/admin/collections/cms-posts/post-1',
    );
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /New project/i })).toHaveAttribute(
      'href',
      '/admin/collections/cms-projects/create',
    );
  });
});
