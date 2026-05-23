'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Root-level not-found renders outside the [locale] layout, so there's no
// TranslationsProvider in scope. Hardcoded EN copy; a locale-aware 404 would
// live at /app/[locale]/not-found.tsx if/when we need bilingual messaging.
export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-primary text-9xl font-bold">404</h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-foreground text-2xl font-semibold">
              Page not found
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/"
            className="text-primary-foreground bg-primary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 active:shadow active:duration-75 inline-flex items-center rounded-lg px-6 py-3 text-base font-medium shadow transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
