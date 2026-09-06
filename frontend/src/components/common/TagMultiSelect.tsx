import { useEffect, useRef, useState } from 'react';

interface TagMultiSelectProps {
  tags: { id: number; name: string; slug: string }[];
  selectedTags: string[];
  onToggle: (tagName: string) => void;
}

export default function TagMultiSelect({ tags, selectedTags, onToggle }: TagMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => { setQuery(''); }, [open]);

  const filtered = query
    ? tags.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
    : tags;

  return (
    <div className="position-relative d-inline-block" ref={ref}>
      <button
        type="button"
        className="btn btn-outline-secondary dropdown-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <i className="fa fa-tags mr-1" />
        {selectedTags.length > 0 ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}` : 'Filter by tags'}
      </button>

      {open && (
        <div
          className="dropdown-menu show p-3"
          style={{ minWidth: 240, maxHeight: 360, overflowY: 'auto' }}
          role="listbox"
          aria-multiselectable="true"
        >
          <div className="input-group mb-2">
            <input
              ref={inputRef}
              type="search"
              className="form-control form-control-sm"
              placeholder="Search tags…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {filtered.length > 0 && (
            <div className="mb-1">
              <a
                href="#"
                className="small text-primary"
                onClick={e => { e.preventDefault(); filtered.forEach(t => { if (!selectedTags.includes(t.name)) onToggle(t.name); }); }}
              >
                Select all
              </a>
              {' \u00b7 '}
              <a
                href="#"
                className="small text-primary"
                onClick={e => { e.preventDefault(); filtered.forEach(t => { if (selectedTags.includes(t.name)) onToggle(t.name); }); }}
              >
                Clear
              </a>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-muted small py-2">No tags found.</div>
          )}

          {filtered.map(tag => {
            const active = selectedTags.includes(tag.name);
            return (
              <label
                key={tag.id}
                className="dropdown-item py-1 d-flex align-items-center gap-2"
                style={{ cursor: 'pointer', opacity: active ? 1 : 0.6 }}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onToggle(tag.name)}
                  className="m-0"
                />
                <span>{tag.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
