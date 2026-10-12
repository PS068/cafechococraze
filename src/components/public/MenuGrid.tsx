import { UtensilsCrossed } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem, Category, FoodType } from '../../types';

interface MenuGridProps {
  items: MenuItem[];
  categories: Category[];
  activeCategory: string | null;
  searchQuery: string;
  dietaryFilter?: 'all' | 'veg' | 'nonveg' | 'spicy';
  onSelectItem?: (item: MenuItem) => void;
}

export default function MenuGrid({
  items,
  categories,
  activeCategory,
  searchQuery,
  dietaryFilter = 'all',
  onSelectItem,
}: MenuGridProps) {
  // Filter items: availability + category + search query + dietary preference
  let filtered = items.filter((item) => item.is_available);

  if (activeCategory) {
    filtered = filtered.filter((item) => item.category_id === activeCategory);
  }

  if (dietaryFilter === 'veg') {
    filtered = filtered.filter((item) => item.food_type === 'veg');
  } else if (dietaryFilter === 'nonveg') {
    filtered = filtered.filter((item) => item.food_type === 'nonveg');
  } else if (dietaryFilter === 'spicy') {
    filtered = filtered.filter(
      (item) => item.labels.includes('Spicy') || (item.spice_level && item.spice_level !== 'none')
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  // Group by category when showing "All" categories and no search query
  if (!activeCategory && !searchQuery.trim() && dietaryFilter === 'all') {
    const grouped = categories
      .map((cat) => ({
        category: cat,
        items: filtered.filter((item) => item.category_id === cat.id),
      }))
      .filter((g) => g.items.length > 0);

    return (
      <div id="menu" className="space-y-12">
        {grouped.map(({ category, items: catItems }) => (
          <section key={category.id}>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <h2
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {category.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                {catItems.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
              {catItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onSelect={onSelectItem} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // Flat grid for filtered/searched
  if (filtered.length === 0) {
    return (
      <div
        className="text-center py-16 px-4 rounded-3xl border my-8"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}
        >
          <UtensilsCrossed size={28} />
        </div>
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          No matching dishes found
        </h3>
        <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
          {searchQuery
            ? `We couldn't find any dishes matching "${searchQuery}". Try a different keyword.`
            : 'No dishes are available for the selected dietary filter.'}
        </p>
      </div>
    );
  }

  return (
    <div id="menu" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
      {filtered.map((item) => (
        <MenuItemCard key={item.id} item={item} onSelect={onSelectItem} />
      ))}
    </div>
  );
}
