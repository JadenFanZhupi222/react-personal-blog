'use client';

import { useEffect, useState } from 'react';

const MIN_CORES = 4;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowEnd = (navigator.hardwareConcurrency ?? MIN_CORES) < MIN_CORES;

    const update = () => setReduced(mq.matches || lowEnd);
    update();

    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}
