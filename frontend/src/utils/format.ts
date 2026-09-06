const MONTHS = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June',
  'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.',
];

export function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function truncateWords(text: string, words: number): string {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= words) return text.trim();
  return `${parts.slice(0, words).join(' ')}...`;
}

export function slugToTagName(tags: { name: string; slug: string }[], slug: string): string {
  const match = tags.find(t => t.slug === slug);
  return match ? match.name : slug;
}