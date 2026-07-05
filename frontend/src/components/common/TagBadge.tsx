import { Link } from 'react-router-dom';

interface TagBadgeProps {
  name: string;
  linkPrefix?: string;
}

export default function TagBadge({ name, linkPrefix = '/blog/tags/' }: TagBadgeProps) {
  return (
    <Link
      to={`${linkPrefix}${name.toLowerCase()}/`}
      className="badge m-1"
      style={{
        backgroundColor: 'var(--tag-bg-color)',
        color: 'var(--tag-font-color)',
        transition: 'all .2s ease-in-out',
      }}
    >
      {name}
    </Link>
  );
}
