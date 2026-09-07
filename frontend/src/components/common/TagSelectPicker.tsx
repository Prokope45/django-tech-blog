import { useEffect, useRef, useState } from 'react';

interface TagOption {
  id: number;
  name: string;
  slug: string;
}

interface TagSelectPickerProps {
  tags: TagOption[];
  selectedTags: string[];
  onToggle: (tagName: string) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  title?: string;
}

export default function TagSelectPicker({
  tags,
  selectedTags,
  onToggle,
  onSelectAll,
  onDeselectAll,
  title = 'Filter by tags',
}: TagSelectPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      return;
    }
    const handleOutsideClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const filteredTags = searchQuery.trim()
    ? tags.filter(t => t.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : tags;

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll();
    } else {
      filteredTags.forEach(t => {
        if (!selectedTags.includes(t.name)) onToggle(t.name);
      });
    }
  };

  const handleDeselectAll = () => {
    if (onDeselectAll) {
      onDeselectAll();
    } else {
      filteredTags.forEach(t => {
        if (selectedTags.includes(t.name)) onToggle(t.name);
      });
    }
  };

  const displayTitle =
    selectedTags.length === 0
      ? title
      : selectedTags.length === 1
      ? selectedTags[0]
      : `${selectedTags.length} tags selected`;

  return (
    <div
      ref={ref}
      className="bootstrap-select"
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '218px'
      }}
    >
      <button
        type="button"
        className="btn dropdown-toggle"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={displayTitle}
      >
        <span className="filter-option">{displayTitle}</span>
      </button>

      {open && (
        <div
          className="dropdown-menu show"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: '220px',
            maxHeight: '340px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          role="listbox"
          aria-multiselectable="true"
        >
          <div className="bs-searchbox">
            <input
              ref={searchInputRef}
              type="text"
              className="form-control"
              autoComplete="off"
              role="textbox"
              aria-label="Search"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bs-actionsbox">
            <button
              type="button"
              className="btn btn-light"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={handleDeselectAll}
            >
              Deselect All
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '220px' }}>
            {filteredTags.length === 0 ? (
              <div className="no-results">
                No results matched &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredTags.map(tag => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className={`dropdown-item d-flex align-items-center'}`}
                    onClick={() => onToggle(tag.name)}
                    role="option"
                    aria-selected={isSelected}
                    style={{ gap: '8px' }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{ pointerEvents: 'none', margin: 0, accentColor: 'var(--button-border-color)' }}
                    />
                    <span className="text">{tag.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
