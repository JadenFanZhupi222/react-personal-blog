import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectArtwork } from './ProjectArtwork';

describe('ProjectArtwork', () => {
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
