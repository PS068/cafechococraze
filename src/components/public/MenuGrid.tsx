import { UtensilsCrossed } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem, Category } from '../../types';
import { groupMenuItemVariants, isPizzaVariantGroup, type MenuItemWithVariants } from '../../lib/menuVariants';

interface MenuGridProps {
  items: MenuItem[];
  categories: Category[];
  activeCategory: string | null;
  searchQuery: string;
  dietaryFilter?: 'all' | 'veg' | 'nonveg' | 'spicy';
  onSelectItem?: (item: MenuItem) => void;
}

function renderSegregatedCards(groups: MenuItemWithVariants[], onSelectItem?: (item: MenuItem) => void) {
  const nonPizzas = groups.filter((g) => !isPizzaVariantGroup(g));
  const pizzas = groups.filter((g) => isPizzaVariantGroup(g));

  return (
    <div className="space-y-4 sm:space-y-6">
      {nonPizzas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 items-stretch">
          {nonPizzas.map(({ item, variants }) => (
            <MenuItemCard
              key={item.id}
              item={item}
              variants={variants}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      )}
      {pizzas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 items-stretch">
          {pizzas.map(({ item, variants }) => (
            <MenuItemCard
              key={item.id}
              item={item}
              variants={variants}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      )}
    </div>
  );
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
      .map((cat) => {
        const catItems = filtered.filter((item) => item.category_id === cat.id);
        const variantGroups = groupMenuItemVariants(catItems);
        return {
          category: cat,
          items: variantGroups,
        };
      })
      .filter((g) => g.items.length > 0);

    return (
      <div id="menu" className="space-y-12 sm:space-y-14">
        {grouped.map(({ category, items: variantGroups }) => (
          <section key={category.id} className="mb-10 sm:mb-12">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
              <h2
                className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {category.name}
              </h2>
              <span className="text-xs text-stone-500 font-medium px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                {variantGroups.length} items
              </span>
            </div>
            {renderSegregatedCards(variantGroups, onSelectItem)}
          </section>
        ))}
      </div>
    );
  }

  // Flat grid for filtered/searched
  if (filtered.length === 0) {
    return (
      <div
        id="menu"
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
          No matching cafe items found
        </h3>
        <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
          {searchQuery
            ? `We couldn't find any items matching "${searchQuery}". Try searching for coffees, shakes, or fries.`
            : 'No items are available for the selected filter.'}
        </p>
      </div>
    );
  }

  const variantGroups = groupMenuItemVariants(filtered);

  return (
    <div id="menu" className="w-full">
      {renderSegregatedCards(variantGroups, onSelectItem)}
    </div>
  );
}
