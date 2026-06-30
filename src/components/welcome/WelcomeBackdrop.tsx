'use client';

import { useReducedMotion } from './lib/useReducedMotion';

const codeColumns = [
  ['const', 'ship', '=', 'true', 'return'],
  ['type', 'Stack', 'React', 'Next', 'GSAP'],
  ['await', 'build()', 'cache', 'edge', '200'],
  ['steam', 'rare', 'unlock', 'xp', 'level'],
  ['blog', 'mdx', 'code', 'read', 'write'],
  ['mongo', 'query', 'parse', 'route', 'json'],
];

export function WelcomeBackdrop() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="welcome-backdrop pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      <div data-effect="welcome-circuit-grid" className="welcome-circuit-grid absolute inset-0" />
      <div
        data-effect="welcome-beam-field"
        className="welcome-beam-field absolute inset-y-0 left-1/2 w-[72rem] max-w-[120vw] -translate-x-1/2"
      />
      {!reduced && (
        <div data-effect="welcome-code-rain" className="welcome-code-rain absolute inset-0">
          {codeColumns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="welcome-code-rain__column"
              style={
                {
                  '--column-index': columnIndex,
                  '--column-delay': `${columnIndex * -1.35}s`,
                } as React.CSSProperties
              }
            >
              {column.map((token, tokenIndex) => (
                <span key={`${token}-${tokenIndex}`}>{token}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
