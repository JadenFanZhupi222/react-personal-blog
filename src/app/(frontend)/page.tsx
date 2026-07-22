import { TranslationsProvider } from '@/contexts/TranslationsContext';
import { Welcome } from '@/components/welcome';

// Welcome page is locale-neutral at the URL level; it picks a display locale
// from the preferred_locale cookie via TranslationsProvider's cookie path.
// ZH users see a brief EN→ZH transition on first paint (acceptable for the
// entry page). Click 'Enter' → /{locale}/home from there on, no flash.
export default function WelcomePage() {
  return (
    <TranslationsProvider>
      <Welcome />
    </TranslationsProvider>
  );
}
