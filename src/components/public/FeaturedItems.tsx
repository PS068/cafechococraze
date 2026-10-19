import { Sparkles } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem } from '../../types';
import { groupMenuItemVariants, isPizzaVariantGroup } from '../../lib/menuVariants';

interface FeaturedItemsProps {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
}

export default function FeaturedItems({ items, onSelectItem }: FeaturedItemsProps) {
  if (items.length === 0) return null;

  const variantGroups = groupMenuItemVariants(items);
  const nonPizzaGroups = variantGroups.filter((g) => !isPizzaVariantGroup(g));
  const pizzaGroups = variantGroups.filter((g) => isPizzaVariantGroup(g));

  return (
    <section className="mb-14 sm:mb-16">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block shrink-0" />
        <div>
          <h2
            className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Signature Cafe Craze
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Top cold coffees, thick shakes, chocolicks &amp; handcrafted cafe specialties
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Non-pizza items in full rows of 4 */}
        {nonPizzaGroups.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 items-stretch">
            {nonPizzaGroups.map(({ item, variants }) => (
              <MenuItemCard
                key={item.id}
                item={item}
                variants={variants}
                onSelect={onSelectItem}
              />
            ))}
          </div>
        )}

        {/* Dedicated row(s) for pizzas — never mixed with non-pizza items */}
        {pizzaGroups.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 items-stretch">
            {pizzaGroups.map(({ item, variants }) => (
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
    </section>
  );
}
