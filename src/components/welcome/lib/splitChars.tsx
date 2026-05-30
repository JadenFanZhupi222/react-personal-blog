import { Fragment } from 'react';

export function splitChars(text: string) {
  return Array.from(text).map((char, i) => (
    <Fragment key={i}>
      <span
        data-char
        style={{ display: 'inline-block', willChange: 'transform' }}
      >
        {char === ' ' ? ' ' : char}
      </span>
    </Fragment>
  ));
}
