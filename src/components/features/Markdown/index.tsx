import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-foreground mt-8 mb-4 text-4xl leading-tight font-extrabold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-foreground mt-8 mb-3 text-3xl leading-snug font-bold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-foreground mt-6 mb-2 text-2xl leading-snug font-semibold">{children}</h3>
  ),
  p: ({ children }) => <p className="text-foreground mb-4 text-base leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ children, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;

    if (isInline) {
      return (
        <code
          className="bg-code-inline-bg text-foreground border-code-inline-border rounded-md border px-2 py-1 font-mono text-sm font-medium"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  blockquote: ({ children }) => (
    <blockquote className="border-primary text-muted-foreground bg-muted/30 mb-4 rounded-r-md border-l-4 py-2 pl-4 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto">
      <table className="bg-table-bg border-table-border w-full border-collapse rounded-lg border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-table-header-bg">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-table-border divide-y">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-table-row-hover transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="text-foreground border-table-border border-b px-4 py-3 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="text-foreground px-4 py-3 text-sm">{children}</td>,
  hr: () => <hr className="border-border my-8 border-dashed" />,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
    >
      {children}
    </ReactMarkdown>
  );
}
