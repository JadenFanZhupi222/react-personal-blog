import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
}

export function Badge({ children, icon = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors',
        className
      )}
    >
      {icon && <Tag className="h-3 w-3" />}
      {children}
    </span>
  );
}
