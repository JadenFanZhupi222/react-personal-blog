import { useTranslationsContext } from '@/contexts/TranslationsContext';

export function useTranslations() {
  const { locale, translations, setLocale } = useTranslationsContext();
  return {
    t: translations,
    locale,
    setLocale,
  };
}
