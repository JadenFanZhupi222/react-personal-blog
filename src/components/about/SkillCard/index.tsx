import { Skills } from '@/lib/about/types';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { Badge } from '@/components/ui/Badge';
import { GlareCard } from '@/components/effects/GlareCard';

interface SkillCardProps {
  title: string;
  items: string[];
}

export function SkillCard({ title, items }: SkillCardProps) {
  return (
    <GlareCard subtle className="rounded-xl">
      <div className="observatory-panel h-full rounded-xl p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-[-0.01em]">{title}</h3>
          <span className="font-mono text-xs text-primary tabular-nums">{items.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <Badge
              key={i}
              icon={false}
              className="border border-primary/20 bg-primary/10 text-foreground hover:border-primary/45 hover:text-primary"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </GlareCard>
  );
}

interface SkillCardListProps {
  skills: Skills | null;
}

export function SkillCardList({ skills }: SkillCardListProps) {
  const { t } = useTranslations();
  if (!skills) return null;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Object.entries(skills)
        .filter(([, items]) => Array.isArray(items) && items.length > 0)
        .map(([category, items]) => (
          <SkillCard
            key={category}
            title={
              t.about.skills.categories[category as keyof typeof t.about.skills.categories] ||
              category
            }
            items={items}
          />
        ))}
    </div>
  );
}
