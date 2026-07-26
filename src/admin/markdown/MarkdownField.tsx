'use client';

import {
  FieldDescription,
  FieldError,
  FieldLabel,
  useField,
} from '@payloadcms/ui';
import type { TextareaFieldClientProps } from 'payload';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  applyMarkdownCommand,
  countWords,
  type MarkdownCommand,
} from './commands';

type EditorMode = 'edit' | 'preview';

type PreviewBoundaryProps = {
  children: React.ReactNode;
  onReturnToEdit: () => void;
};

type PreviewBoundaryState = {
  failed: boolean;
};

class PreviewBoundary extends React.Component<PreviewBoundaryProps, PreviewBoundaryState> {
  state: PreviewBoundaryState = { failed: false };

  static getDerivedStateFromError(): PreviewBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="zp-markdown__empty" role="alert">
          <strong>Preview could not be rendered.</strong>
          <span>Your Markdown is still safe in the editor.</span>
          <button onClick={this.props.onReturnToEdit} type="button">
            Return to edit
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const toolbar: Array<{
  command: MarkdownCommand;
  label: string;
  symbol: string;
}> = [
  { command: 'bold', label: 'Bold', symbol: 'B' },
  { command: 'italic', label: 'Italic', symbol: 'I' },
  { command: 'heading', label: 'Heading', symbol: 'H2' },
  { command: 'link', label: 'Link', symbol: '↗' },
  { command: 'code', label: 'Inline code', symbol: '{ }' },
  { command: 'list', label: 'List', symbol: '—' },
];

export function MarkdownField({
  field,
  path,
  readOnly,
}: TextareaFieldClientProps) {
  const [mode, setMode] = React.useState<EditorMode>('edit');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { errorMessage, setValue, showError, value = '' } = useField<string>({ path });
  const inputID = `field-${path.replaceAll('.', '-')}`;
  const accessibleLabel = typeof field.label === 'string' ? field.label : field.name;

  const runCommand = React.useCallback(
    (command: MarkdownCommand) => {
      const textarea = textareaRef.current;
      if (!textarea || readOnly) return;

      const edit = applyMarkdownCommand(
        value,
        textarea.selectionStart,
        textarea.selectionEnd,
        command,
      );
      setValue(edit.value);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
      });
    },
    [readOnly, setValue, value],
  );

  return (
    <div className={`field-type textarea zp-markdown${showError ? ' error' : ''}`}>
      <div className="zp-markdown__heading">
        <div>
          <FieldLabel
            htmlFor={inputID}
            label={field.label}
            localized={field.localized}
            path={path}
            required={field.required}
          />
          {field.admin?.description ? (
            <FieldDescription
              description={field.admin.description}
              marginPlacement="bottom"
              path={path}
            />
          ) : null}
        </div>
        <div aria-label="Editor mode" className="zp-markdown__modes" role="tablist">
          {(['edit', 'preview'] as const).map((nextMode) => (
            <button
              aria-controls={`${inputID}-${nextMode}`}
              aria-selected={mode === nextMode}
              className={mode === nextMode ? 'is-active' : undefined}
              key={nextMode}
              onClick={() => setMode(nextMode)}
              role="tab"
              type="button"
            >
              {nextMode === 'edit' ? 'Edit' : 'Preview'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'edit' ? (
        <div className="zp-markdown__editor" id={`${inputID}-edit`} role="tabpanel">
          <div aria-label="Markdown formatting" className="zp-markdown__toolbar">
            <div>
              {toolbar.map((item) => (
                <button
                  aria-label={item.label}
                  disabled={readOnly}
                  key={item.command}
                  onClick={() => runCommand(item.command)}
                  title={item.label}
                  type="button"
                >
                  {item.symbol}
                </button>
              ))}
            </div>
            <span aria-live="polite">{countWords(value)} words</span>
          </div>
          <textarea
            aria-invalid={showError || undefined}
            aria-label={accessibleLabel}
            disabled={readOnly}
            id={inputID}
            onChange={(event) => setValue(event.target.value)}
            ref={textareaRef}
            rows={field.admin?.rows ?? 30}
            value={value}
          />
        </div>
      ) : (
        <div className="zp-markdown__preview" id={`${inputID}-preview`} role="tabpanel">
          {value.trim() ? (
            <PreviewBoundary key={value} onReturnToEdit={() => setMode('edit')}>
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
              >
                {value}
              </ReactMarkdown>
            </PreviewBoundary>
          ) : (
            <div className="zp-markdown__empty">
              <strong>Nothing to preview yet.</strong>
              <span>Start writing Markdown, then return here to review it.</span>
              <button onClick={() => setMode('edit')} type="button">
                Return to edit
              </button>
            </div>
          )}
        </div>
      )}

      <FieldError message={errorMessage} path={path} showError={showError} />
    </div>
  );
}
