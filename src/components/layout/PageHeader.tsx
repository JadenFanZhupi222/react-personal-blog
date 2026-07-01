interface PageHeaderProps {
  heading: string;
  text?: string;
}

export function PageHeader({ heading, text }: PageHeaderProps) {
  return (
    <div className="observatory-signal-line max-w-3xl space-y-4 pt-6">
      <div
        aria-hidden="true"
        className="inline-flex h-7 w-32 items-center gap-2 rounded-full border border-border/70 bg-card-30 px-3 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--foreground)_8%,transparent)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" />
        <span className="h-px flex-1 bg-gradient-to-r from-primary/70 to-transparent" />
      </div>
      <h1 className="text-balance text-4xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">
        {heading}
      </h1>
      {text && <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{text}</p>}
    </div>
  );
}
