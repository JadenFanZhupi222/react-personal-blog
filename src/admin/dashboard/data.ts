import type { Payload } from 'payload';

export type DashboardFailure = 'posts' | 'projects' | 'experiences' | 'media';

export type RecentItem = {
  id: number | string;
  title: string;
  type: 'Post' | 'Project' | 'Experience';
  collection: 'cms-posts' | 'cms-projects' | 'cms-experiences';
  status?: 'draft' | 'published';
  updatedAt: string;
};

export type DashboardData = {
  metrics: {
    drafts: number | null;
    posts: number | null;
    projects: number | null;
    experiences: number | null;
    media: number | null;
  };
  recent: RecentItem[];
  failures: DashboardFailure[];
};

type DashboardDocument = {
  id: number | string;
  title?: unknown;
  updatedAt?: unknown;
  _status?: unknown;
};

const queries = [
  { key: 'posts', collection: 'cms-posts', type: 'Post' },
  { key: 'projects', collection: 'cms-projects', type: 'Project' },
  { key: 'experiences', collection: 'cms-experiences', type: 'Experience' },
  { key: 'media', collection: 'media', type: 'Media' },
] as const;

function asDashboardDocument(value: unknown): DashboardDocument | null {
  if (!value || typeof value !== 'object' || !('id' in value)) return null;
  return value as DashboardDocument;
}

export async function loadDashboardData(payload: Pick<Payload, 'find'>): Promise<DashboardData> {
  const settled = await Promise.allSettled(
    queries.map((query) =>
      payload.find({
        collection: query.collection,
        depth: 0,
        limit: query.collection === 'media' ? 0 : 5,
        locale: 'en',
        overrideAccess: false,
        sort: '-updatedAt',
      }),
    ),
  );

  const failures: DashboardFailure[] = [];
  const metrics: DashboardData['metrics'] = {
    drafts: 0,
    posts: 0,
    projects: 0,
    experiences: 0,
    media: 0,
  };
  const recent: RecentItem[] = [];

  settled.forEach((result, index) => {
    const query = queries[index];

    if (result.status === 'rejected') {
      failures.push(query.key);
      metrics[query.key] = null;
      if (query.key === 'posts') metrics.drafts = null;
      return;
    }

    metrics[query.key] = result.value.totalDocs;
    const documents = result.value.docs
      .map(asDashboardDocument)
      .filter((document): document is DashboardDocument => document !== null);

    if (query.key === 'posts') {
      metrics.drafts = documents.filter((document) => document._status === 'draft').length;
    }

    if (query.type === 'Media') return;

    documents.forEach((document) => {
      recent.push({
        id: document.id,
        title: typeof document.title === 'string' ? document.title : 'Untitled',
        type: query.type,
        collection: query.collection,
        status:
          document._status === 'draft' || document._status === 'published'
            ? document._status
            : undefined,
        updatedAt:
          typeof document.updatedAt === 'string'
            ? document.updatedAt
            : new Date(0).toISOString(),
      });
    });
  });

  recent.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  return {
    failures,
    metrics,
    recent: recent.slice(0, 6),
  };
}
