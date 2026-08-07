import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectArtwork } from './ProjectArtwork';

describe('ProjectArtwork', () => {
  it('renders the dedicated artwork for the multi-terminal system', () => {
    const artwork = renderToStaticMarkup(
      <ProjectArtwork
        slug="multi-terminal-capture-print-system"
        order={-15}
        title="Multi-Terminal Capture & Print System"
      />
    );

    expect(artwork).toContain('Three-terminal flow / 01');
    expect(artwork).toContain('ENTRANCE');
    expect(artwork).toContain('PHONE WEB');
    expect(artwork).toContain('EXIT PRINT');
    expect(artwork).toContain('hidden font-mono');
    expect(artwork).not.toContain('Date system / 03');
  });

  it('renders repository artwork for the Strata project', () => {
    const artwork = renderToStaticMarkup(
      <ProjectArtwork slug="git-client" order={-10} title="Strata" />
    );

    expect(artwork).toContain('Repository graph / 00');
    expect(artwork).toContain('main');
    expect(artwork).not.toContain('Date system / 03');
  });

  it('uses project order to distinguish legacy records without slugs', () => {
    const mealPlanner = renderToStaticMarkup(
      <ProjectArtwork slug="" order={1} title="Meal planner" />
    );
    const datePicker = renderToStaticMarkup(
      <ProjectArtwork slug="" order={100} title="Date picker" />
    );

    expect(mealPlanner).toContain('Meal planner / 02');
    expect(datePicker).toContain('Date system / 03');
  });
});
