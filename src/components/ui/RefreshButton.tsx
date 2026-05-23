import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/lib/hooks/useTranslations';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

export function RefreshButton({ onClick, isLoading, className }: RefreshButtonProps) {
  const { t } = useTranslations();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'hover:bg-primary-hover/30 hover:scale-110 active:scale-95 active:duration-75 transition-transform duration-200 h-8 w-8 cursor-pointer',
        className
      )}
    >
      <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
      <span className="sr-only">{t.common.refresh}</span>
    </Button>
  );
}
