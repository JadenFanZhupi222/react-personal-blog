import { ExternalLink } from 'lucide-react';

export function ProjectTitleLink({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  if (!url) {
    return <span>{title}</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="inline-flex items-center gap-2">
        {title}
        <ExternalLink
          data-testid="project-external-link"
          className="text-primary h-4 w-4"
        />
      </span>
    </a>
  );
}
