import { describe, expect, it } from 'vitest';
import { applyMarkdownCommand, countWords } from './commands';

describe('applyMarkdownCommand', () => {
  it('wraps selected text and preserves the inner selection', () => {
    expect(applyMarkdownCommand('calm UI', 0, 4, 'bold')).toEqual({
      value: '**calm** UI',
      selectionStart: 2,
      selectionEnd: 6,
    });
  });

  it('inserts a heading at the beginning of the current line', () => {
    expect(applyMarkdownCommand('intro\nsection', 8, 8, 'heading')).toEqual({
      value: 'intro\n## section',
      selectionStart: 11,
      selectionEnd: 11,
    });
  });

  it('inserts link syntax around a selection', () => {
    expect(applyMarkdownCommand('Read docs', 5, 9, 'link')).toEqual({
      value: 'Read [docs](https://)',
      selectionStart: 6,
      selectionEnd: 10,
    });
  });
});

describe('countWords', () => {
  it('counts Latin words and CJK characters predictably', () => {
    expect(countWords('calm interface 中文')).toBe(4);
  });

  it('returns zero for whitespace-only content', () => {
    expect(countWords(' \n\t ')).toBe(0);
  });
});
