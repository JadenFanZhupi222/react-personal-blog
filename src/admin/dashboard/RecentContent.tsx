import type { RecentItem } from './data';

type RecentContentProps = {
  items: RecentItem[];
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function RecentContent({ items }: RecentContentProps) {
  return (
    <section className="zp-dashboard-panel zp-recent" aria-labelledby="recent-content-title">
      <header className="zp-dashboard-panel__header">
        <div>
          <h2 id="recent-content-title">Recently updated</h2>
          <p>Continue where you left off.</p>
        </div>
      </header>
      {items.length === 0 ? (
        <div className="zp-recent__empty">
          <p>No content has been updated yet.</p>
          <a href="/admin/collections/cms-posts/create">Create your first post</a>
        </div>
      ) : (
        <div className="zp-recent__list">
          {items.map((item) => (
            <a
              className="zp-recent__item"
              href={`/admin/collections/${item.collection}/${item.id}`}
              key={`${item.collection}-${item.id}`}
            >
              <span aria-hidden="true" className="zp-recent__icon">
                {item.type.slice(0, 2)}
              </span>
              <span className="zp-recent__copy">
                <strong>{item.title}</strong>
                <small>
                  {item.type} · {formatUpdatedAt(item.updatedAt)}
                </small>
              </span>
              {item.status ? (
                <span className={`zp-status zp-status--${item.status}`}>
                  {item.status === 'draft' ? 'Draft' : 'Published'}
                </span>
              ) : (
                <span aria-hidden="true" className="zp-recent__arrow">
                  →
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
