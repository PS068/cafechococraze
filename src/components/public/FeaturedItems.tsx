import { Sparkles } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem } from '../../types';

interface FeaturedItemsProps {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
}

export default function FeaturedItems({ items, onSelectItem }: FeaturedItemsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Chef's Recommendations
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Signature dishes curated especially for your dining experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onSelect={onSelectItem} />
        ))}
      </div>
    </section>
  );
}
