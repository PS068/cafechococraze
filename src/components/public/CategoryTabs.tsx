import { useRef, useEffect } from 'react';
import type { Category } from '../../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const button = activeRef.current;
      const scrollLeft = button.offsetLeft - container.clientWidth / 2 + button.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar pb-1"
    >
      {/* All tab */}
      <button
        ref={activeCategory === null ? activeRef : undefined}
        onClick={() => onSelect(null)}
        className="shrink-0 px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-200 whitespace-nowrap"
        style={{
          backgroundColor: activeCategory === null ? 'var(--accent)' : 'transparent',
          color: activeCategory === null ? 'var(--text-inverse)' : 'var(--text-secondary)',
          borderColor: activeCategory === null ? 'var(--accent)' : 'var(--border-default)',
        }}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          ref={activeCategory === cat.id ? activeRef : undefined}
          onClick={() => onSelect(cat.id)}
          className="shrink-0 px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-200 whitespace-nowrap"
          style={{
            backgroundColor: activeCategory === cat.id ? 'var(--accent)' : 'transparent',
            color: activeCategory === cat.id ? 'var(--text-inverse)' : 'var(--text-secondary)',
            borderColor: activeCategory === cat.id ? 'var(--accent)' : 'var(--border-default)',
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
