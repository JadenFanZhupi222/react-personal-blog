import { getPayload } from 'payload';
import config from '../src/payload.config';
import {
  GIT_CLIENT_PROJECT,
  upsertGitClientProject,
} from '../src/lib/project/gitClientProject';

async function main() {
  const payload = await getPayload({ config });

  try {
    if (!process.argv.includes('--verify')) {
      await upsertGitClientProject(payload);
    }

    for (const locale of ['en', 'zh'] as const) {
      const result = await payload.find({
        collection: 'cms-projects',
        locale,
        fallbackLocale: false,
        where: { slug: { equals: GIT_CLIENT_PROJECT.slug } },
        limit: 1,
        overrideAccess: true,
      });
      const project = result.docs[0];

      if (!project) {
        throw new Error(`Missing ${locale} Git Client project`);
      }

      console.log({
        locale,
        id: project.id,
        slug: project.slug,
        title: project.title,
        order: project.order,
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
