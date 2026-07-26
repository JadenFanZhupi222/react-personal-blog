import type { AdminViewServerProps } from 'payload';
import { Gutter } from '@payloadcms/ui';
import { DashboardMetric } from './DashboardMetric';
import { loadDashboardData } from './data';
import { QuickCreate } from './QuickCreate';
import { RecentContent } from './RecentContent';

export async function AdminDashboard({ payload }: AdminViewServerProps) {
  const data = await loadDashboardData(payload);
  const today = new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date());

  return (
    <Gutter className="zp-dashboard">
      <header className="zp-dashboard__header">
        <div>
          <span className="zp-kicker">{today}</span>
          <h1>Content overview</h1>
          <p>
            {data.metrics.drafts
              ? `${data.metrics.drafts} draft${data.metrics.drafts === 1 ? '' : 's'} waiting for you.`
              : 'Your published content is up to date.'}
          </p>
        </div>
        <a className="zp-primary-action" href="/admin/collections/cms-posts/create">
          <span aria-hidden="true">+</span>
          Create content
        </a>
      </header>

      <section aria-label="Content summary" className="zp-dashboard__metrics">
        <DashboardMetric
          detail="Posts ready to continue"
          featured
          href="/admin/collections/cms-posts?where[_status][equals]=draft"
          label="Draft queue"
          value={data.metrics.drafts}
        />
        <DashboardMetric
          detail="Published and drafted"
          href="/admin/collections/cms-posts"
          label="Posts"
          value={data.metrics.posts}
        />
        <DashboardMetric
          detail="Portfolio entries"
          href="/admin/collections/cms-projects"
          label="Projects"
          value={data.metrics.projects}
        />
        <DashboardMetric
          detail="Career milestones"
          href="/admin/collections/cms-experiences"
          label="Experience"
          value={data.metrics.experiences}
        />
      </section>

      <div className="zp-dashboard__lower">
        <RecentContent items={data.recent} />
        <QuickCreate />
      </div>

      {data.failures.length > 0 ? (
        <p className="zp-dashboard__partial" role="status">
          Some summaries could not be loaded. Refresh to retry.
        </p>
      ) : null}
    </Gutter>
  );
}
