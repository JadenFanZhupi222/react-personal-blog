type DashboardMetricProps = {
  detail?: string;
  featured?: boolean;
  href: string;
  label: string;
  value: number | null;
};

export function DashboardMetric({
  detail,
  featured = false,
  href,
  label,
  value,
}: DashboardMetricProps) {
  return (
    <a
      className={`zp-metric${featured ? ' zp-metric--featured' : ''}`}
      href={href}
      aria-label={`${label}: ${value ?? 'Unavailable'}`}
    >
      <span className="zp-kicker">{label}</span>
      <strong>{value ?? 'Unavailable'}</strong>
      {detail ? <small>{detail}</small> : null}
      <span aria-hidden="true" className="zp-metric__arrow">
        ↗
      </span>
    </a>
  );
}
