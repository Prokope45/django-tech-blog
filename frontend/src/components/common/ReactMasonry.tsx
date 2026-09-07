import React, { useEffect, useState } from 'react';

interface MasonryProps {
  children: React.ReactNode;
  columnsCountBreakPoints?: Record<number, number>;
  gutter?: string;
  className?: string;
  id?: string;
}

export default function ReactMasonry({
  children,
  columnsCountBreakPoints = { 350: 1, 750: 2, 900: 3 },
  gutter = '1rem',
  className = '',
  id,
}: MasonryProps) {
  const [columnsCount, setColumnsCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      const sorted = Object.keys(columnsCountBreakPoints)
        .map(Number)
        .sort((a, b) => b - a);
      for (const bp of sorted) {
        if (width >= bp) {
          setColumnsCount(columnsCountBreakPoints[bp]);
          return;
        }
      }
      setColumnsCount(1);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columnsCountBreakPoints]);

  const columns: React.ReactNode[][] = Array.from({ length: columnsCount }, () => []);
  const validChildren = React.Children.toArray(children);
  validChildren.forEach((child, index) => {
    columns[index % columnsCount].push(child);
  });

  return (
    <div
      id={id}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: gutter,
        width: '100%',
        margin: '0 auto',
      }}
    >
      {columns.map((col, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: gutter,
            flex: 1,
            alignItems: 'center',
          }}
        >
          {col}
        </div>
      ))}
    </div>
  );
}
