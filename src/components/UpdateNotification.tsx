'use client';

import { useRef, useEffect, useState } from 'react';
import { showToast } from '@/components/features/Toast';
import { useTranslations } from '@/lib/hooks/useTranslations';

const POLL_INTERVAL = 5 * 60 * 1000; // 5min

export function UpdateNotification() {
  const { t, locale, loading } = useTranslations();
  const hasShown = useRef(false);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = () =>
      fetch('/api/version')
        .then((res) => res.json())
        .then((data) => data?.version && setVersion(data.version))
        .catch(() => {});

    fetchVersion();
    const id = setInterval(fetchVersion, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (loading || !version) return;

    const lastVersion = localStorage.getItem('app-version');

    if (lastVersion !== version && !hasShown.current) {
      localStorage.setItem('app-version', version);
      hasShown.current = true;
      showToast({
        title: t.common.update.title,
        message: t.common.update.message,
        actionLabel: t.common.update.refresh,
        onAction: () => window.location.reload(),
      });
    }
  }, [version, locale, loading, t.common.update.title, t.common.update.message, t.common.update.refresh]);

  return null;
}
