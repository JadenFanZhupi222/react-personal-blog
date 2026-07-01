import { Card } from '@/components/ui/Card';
import { Experience } from '@/lib/about/types';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { CollapsibleCard } from '@/components/features/CollapsibleCard';

interface ExperienceCardProps {
  exp: Experience;
  index: number;
}

export function ExperienceCard({ exp, index }: ExperienceCardProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Card
        key={index}
        className="observatory-panel relative rounded-xl bg-card/80 text-card-foreground md:before:absolute md:before:-left-[2.55rem] md:before:top-8 md:before:h-3 md:before:w-3 md:before:rounded-full md:before:bg-primary md:before:shadow-[0_0_18px_var(--primary)]"
      >
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold tracking-[-0.02em]">{exp.title}</h3>
              <p className="text-primary">{exp.company}</p>
            </div>
            <span className="shrink-0 rounded-full border border-border/70 bg-background/30 px-3 py-1 font-mono text-xs text-muted-foreground">
              {exp.period}
            </span>
          </div>
          <p className="mb-5 leading-7 text-muted-foreground">{exp.description}</p>
          <ul className="space-y-2 text-muted-foreground">
            {exp.achievements.map((achievement, i) => (
              <li key={i} className="flex gap-3 leading-7">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    );
  }

  return (
    <CollapsibleCard
      header={
        <div>
          <h3 className="mb-1 text-base font-semibold">{exp.title}</h3>
          <p className="mb-1 text-xs text-muted-foreground">{exp.period}</p>
          <p className="text-sm text-primary">{exp.company}</p>
        </div>
      }
      className="observatory-panel mb-2 rounded-xl"
    >
      <p className="mb-2 text-xs text-muted-foreground">{exp.description}</p>
      <ul className="list-disc space-y-1 pl-4">
        {exp.achievements.map((achievement, i) => (
          <li key={i} className="text-xs">
            {achievement}
          </li>
        ))}
      </ul>
    </CollapsibleCard>
  );
}
