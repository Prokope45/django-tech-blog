import { Link } from 'react-router-dom';

interface TagBadgeProps {
  name: string;
  slug?: string;
  to?: string;
  stopPropagation?: boolean;
}

export default function TagBadge({ name, slug, to, stopPropagation }: TagBadgeProps) {
  const href = to ?? (slug ? `/blog/tags/${slug}` : `/blog/tags/${name.toLowerCase()}`);
  return (
    <Link
      to={href}
      className="badge m-1"
      onClick={stopPropagation ? e => e.stopPropagation() : undefined}
    >
      {name}
    </Link>
  );
}