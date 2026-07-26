export type MarkdownCommand = 'bold' | 'italic' | 'heading' | 'link' | 'code' | 'list';

export type MarkdownEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

const wrappers = {
  bold: ['**', '**'],
  italic: ['_', '_'],
  link: ['[', '](https://)'],
  code: ['`', '`'],
} as const;

export function applyMarkdownCommand(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  command: MarkdownCommand,
): MarkdownEdit {
  if (command in wrappers) {
    const [before, after] = wrappers[command as keyof typeof wrappers];
    const selected = value.slice(selectionStart, selectionEnd);

    return {
      value: value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd),
      selectionStart: selectionStart + before.length,
      selectionEnd: selectionEnd + before.length,
    };
  }

  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const prefix = command === 'heading' ? '## ' : '- ';

  return {
    value: value.slice(0, lineStart) + prefix + value.slice(lineStart),
    selectionStart: selectionStart + prefix.length,
    selectionEnd: selectionEnd + prefix.length,
  };
}

export function countWords(value: string): number {
  const cjkCount = value.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinCount = value
    .replace(/[\u3400-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return cjkCount + latinCount;
}
