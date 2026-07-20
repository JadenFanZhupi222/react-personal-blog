interface PageHeaderProps {
  heading: string;
  text?: string;
}

export function PageHeader({ heading, text }: PageHeaderProps) {
  return (
    <header className="border-border max-w-4xl border-t pt-6">
      <div aria-hidden="true" className="mb-6 flex items-center gap-3">
        <span className="bg-primary h-2 w-2" />
        <span className="text-muted-foreground font-mono text-[0.68rem] font-semibold tracking-[0.18em]">
          ZHUPI222 / INDEX
        </span>
      </div>
      <h1 className="max-w-3xl text-5xl leading-[0.94] font-black tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
        {heading}
      </h1>
      {text && (
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 text-pretty">{text}</p>
      )}
    </header>
  );
}
