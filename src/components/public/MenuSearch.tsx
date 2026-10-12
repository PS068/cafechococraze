import { Search, X } from 'lucide-react';

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MenuSearch({ value, onChange }: MenuSearchProps) {
  return (
    <div className="relative max-w-md w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      />
      <input
        id="menu-search"
        type="text"
        placeholder="Search menu items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-10 py-3 text-sm rounded-xl border transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
