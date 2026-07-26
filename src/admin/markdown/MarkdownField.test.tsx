import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownField } from './MarkdownField';

const fieldState = vi.hoisted(() => ({
  setValue: vi.fn(),
  value: '# Hello',
}));

vi.mock('@payloadcms/ui', () => ({
  FieldDescription: () => null,
  FieldError: () => null,
  FieldLabel: ({ label }: { label: string }) => <label>{label}</label>,
  useField: () => ({
    errorMessage: undefined,
    setValue: fieldState.setValue,
    showError: false,
    value: fieldState.value,
  }),
}));

const field = {
  name: 'content',
  type: 'textarea' as const,
  label: 'Content',
  required: true,
  admin: {
    description: 'Markdown with GFM and fenced code blocks.',
  },
};

describe('MarkdownField', () => {
  beforeEach(() => {
    fieldState.value = '# Hello';
    fieldState.setValue.mockReset();
  });

  it('switches between editing and rendered preview', () => {
    render(<MarkdownField field={field} path="content" />);

    expect(screen.getByRole('textbox', { name: 'Content' })).toHaveValue('# Hello');
    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(screen.getByRole('heading', { name: 'Hello' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Edit' }));
    expect(screen.getByRole('textbox', { name: 'Content' })).toBeInTheDocument();
  });

  it('applies toolbar commands to the current selection', () => {
    fieldState.value = 'calm interface';
    render(<MarkdownField field={field} path="content" />);

    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Content' });
    textarea.setSelectionRange(0, 4);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));

    expect(fieldState.setValue).toHaveBeenCalledWith('**calm** interface');
  });

  it('shows an actionable empty preview state', () => {
    fieldState.value = '';
    render(<MarkdownField field={field} path="content" />);

    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(screen.getByText('Nothing to preview yet.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Return to edit' })).toBeInTheDocument();
  });
});
