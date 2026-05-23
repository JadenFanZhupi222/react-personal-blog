import { useTranslationsStore } from '@/store/translations';

export function useTranslations() {
  const { locale, translations, setLocale } = useTranslationsStore();
  return {
    t: translations,
    locale,
    setLocale,
  };
}
