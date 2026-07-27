import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectTitleLink } from './ProjectTitleLink';

describe('ProjectTitleLink', () => {
  it('renders a private project title without a link or external icon', () => {
    const { container } = render(
      <ProjectTitleLink title="Private project" url="" />
    );

    expect(screen.getByText('Private project')).toBeInTheDocument();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByTestId('project-external-link')).not.toBeInTheDocument();
  });

  it('links public projects and shows the external icon', () => {
    render(
      <ProjectTitleLink
        title="Public project"
        url="https://example.com/project"
      />
    );

    expect(screen.getByRole('link', { name: 'Public project' })).toHaveAttribute(
      'href',
      'https://example.com/project'
    );
    expect(screen.getByTestId('project-external-link')).toBeInTheDocument();
  });
});
