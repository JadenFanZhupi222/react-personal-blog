import { getPayload } from 'payload';
import config from '../src/payload.config';
import {
  applyFeaturedProjectOrder,
  FEATURED_PROJECT_ORDER,
} from '../src/lib/project/gitClientProject';
import { upsertZodaPlusProject } from '../src/lib/project/zodaPlusProject';

async function main() {
  const payload = await getPayload({ config });

  try {
    if (!process.argv.includes('--verify')) {
      await upsertZodaPlusProject(payload);
      await applyFeaturedProjectOrder(payload);
    }

    for (const locale of ['en', 'zh'] as const) {
      const result = await payload.find({
        collection: 'cms-projects',
        locale,
        fallbackLocale: false,
        where: {
          slug: {
            in: FEATURED_PROJECT_ORDER.map((project) => project.slug),
          },
        },
        sort: 'order',
        limit: FEATURED_PROJECT_ORDER.length,
        overrideAccess: true,
      });
      const expectedSlugs = FEATURED_PROJECT_ORDER.map((project) => project.slug);
      const actualSlugs = result.docs.map((project) => project.slug);

      if (actualSlugs.join(',') !== expectedSlugs.join(',')) {
        throw new Error(
          `Unexpected ${locale} project order: ${actualSlugs.join(',')}`
        );
      }

      console.log({
        locale,
        projects: result.docs.map((project) => ({
          id: project.id,
          slug: project.slug,
          title: project.title,
          order: project.order,
        })),
      });
    }
  } finally {
    await payload.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
