import Link from 'next/link';

const actions = [
  ['New post', '/admin/collections/cms-posts/create', 'P'],
  ['New project', '/admin/collections/cms-projects/create', 'J'],
  ['New experience', '/admin/collections/cms-experiences/create', 'E'],
  ['Site settings', '/admin/globals/site-settings', '→'],
] as const;

export function QuickCreate() {
  return (
    <section className="zp-dashboard-panel zp-quick-create" aria-labelledby="quick-create-title">
      <header className="zp-dashboard-panel__header">
        <div>
          <h2 id="quick-create-title">Quick create</h2>
          <p>Jump straight into your next update.</p>
        </div>
        <span aria-hidden="true" className="zp-quick-create__plus">
          +
        </span>
      </header>
      <nav aria-label="Create content">
        {actions.map(([label, href, shortcut]) => (
          <Link href={href} key={href}>
            <span>{label}</span>
            <kbd>{shortcut}</kbd>
          </Link>
        ))}
      </nav>
    </section>
  );
}
