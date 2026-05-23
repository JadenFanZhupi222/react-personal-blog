import { m } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslations } from '@/lib/hooks/useTranslations';

interface ErrorProps {
  onRetry?: () => void;
}

export function ErrorFunc({ onRetry }: ErrorProps) {
  const { t } = useTranslations();
  const errorTranslations = t?.common?.error;

  if (!errorTranslations) {
    console.error('Error translations not found');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <m.div
        initial={{ rotate: -10, scale: 0.8 }}
        animate={{ rotate: [-10, 10, -10], scale: 1 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="mb-6"
      >
        <AlertTriangle size={64} className="text-yellow-400 drop-shadow-lg" />
      </m.div>
      <h2 className="mb-2 text-2xl font-bold">{errorTranslations.title}</h2>
      <p className="text-muted-foreground mb-6">{errorTranslations.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-primary-foreground hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 active:shadow active:duration-75 flex cursor-pointer items-center gap-2 rounded px-4 py-2 font-semibold shadow transition-all duration-200"
        >
          <RefreshCw className="animate-spin-slow" size={20} /> {errorTranslations.retry}
        </button>
      )}
      <style>{`
        .animate-spin-slow {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
