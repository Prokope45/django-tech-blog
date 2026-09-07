import { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectPickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export default function SelectPicker({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
}: SelectPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
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
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div
      ref={ref}
      className={`bootstrap-select ${className}`}
      style={{ position: 'relative', width: '218px' }}
    >
      <button
        type="button"
        id={id}
        name={name}
        className="btn dropdown-toggle"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="filter-option pull-left">{displayLabel}</span>
      </button>

      {open && (
        <div
          className="dropdown-menu show"
          style={{ position: 'absolute', top: '100%', left: 0, width: '100%', maxHeight: '300px', overflowY: 'auto' }}
          role="listbox"
        >
          {placeholder && !selectedOption && (
            <div
              className="dropdown-item disabled text-muted"
              style={{ opacity: 0.6, pointerEvents: 'none' }}
            >
              {placeholder}
            </div>
          )}
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={`dropdown-item ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
