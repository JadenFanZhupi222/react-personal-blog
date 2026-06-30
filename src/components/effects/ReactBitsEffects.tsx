'use client';

import { GridAura } from './GridAura';
import { PointerGlow } from './PointerGlow';

interface ReactBitsEffectsProps {
  pathname?: string | null;
}

function isBlogDetail(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.length >= 3 && parts[1] === 'blog';
}

export function ReactBitsEffects({ pathname = '' }: ReactBitsEffectsProps) {
  const safePath = pathname ?? '';
  if (safePath === '/' || isBlogDetail(safePath)) return null;

  return (
    <>
      <GridAura intensity={safePath.includes('/blog') ? 'quiet' : 'standard'} />
      <PointerGlow />
    </>
  );
}
