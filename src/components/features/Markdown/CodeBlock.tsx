'use client';

import React from 'react';
import { Check, Copy } from 'lucide-react';
import { CodeScanline } from '@/components/effects/CodeScanline';
import { useTranslations } from '@/lib/hooks/useTranslations';

interface CodeBlockProps {
  children: React.ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const { t } = useTranslations();
  const codeRef = React.useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const text = codeRef.current?.textContent ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be blocked (insecure context / permissions); fail silently.
    }
  };

  return (
    <div className="group relative mb-6">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? t.blog.copied : t.blog.copy}
        className="bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:shadow-secondary/30 absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs opacity-0 backdrop-blur transition-all duration-200 group-hover:opacity-100 hover:shadow-md focus:opacity-100 active:scale-95 active:duration-75"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            {t.blog.copied}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            {t.blog.copy}
          </>
        )}
      </button>
      <CodeScanline>
        <pre className="bg-code-block-bg border-code-block-border text-foreground [&_.hljs]:color-inherit overflow-x-auto rounded-xl border p-4 text-sm shadow-lg transition-colors duration-200 [&_.hljs]:bg-transparent [&_code]:bg-transparent [&_code]:text-inherit">
          <div ref={codeRef}>{children}</div>
        </pre>
      </CodeScanline>
    </div>
  );
}
