import { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  Plus,
  Check,
  SlidersHorizontal,
  Flame,
  ChefHat,
  Eye,
} from 'lucide-react';
import { FOOD_CATALOG, type CatalogItem } from '../../data/foodCatalog';
import { useData } from '../../context/DataContext';
import type { MenuItemFormData } from '../../types';
import { formatINR } from '../../lib/formatters';

interface DishCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForCustomize: (formData: MenuItemFormData) => void;
}

export default function DishCatalogModal({
  isOpen,
  onClose,
  onSelectForCustomize,
}: DishCatalogModalProps) {
  const { menuItems, addMenuItem, ensureCategory } = useData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [addingId, setAddingId] = useState<string | null>(null);

  // Set of dish names currently on the menu (case-insensitive)
  const existingDishNames = useMemo(() => {
    return new Set(menuItems.map((item) => item.name.trim().toLowerCase()));
  }, [menuItems]);

  // Extract unique category names
  const catalogCategories = useMemo(() => {
    const cats = new Set(FOOD_CATALOG.map((item) => item.categoryName));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filtered catalog items
  const filteredItems = useMemo(() => {
    return FOOD_CATALOG.filter((item) => {
      // Search
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(search.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || item.categoryName === selectedCategory;

      // Diet filter
      const matchesDiet =
        dietFilter === 'all' || item.food_type === dietFilter;

      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [search, selectedCategory, dietFilter]);

  if (!isOpen) return null;

  // Single-click instant add
  const handleSingleClickAdd = async (item: CatalogItem) => {
    setAddingId(item.id);
    try {
      const categoryId = await ensureCategory(item.categoryName);
      const formData: MenuItemFormData = {
        name: item.name,
        description: item.description,
        price: item.price,
        discounted_price: null,
        category_id: categoryId,
        image_url: item.image_url,
        food_type: item.food_type,
        is_available: true,
        is_featured: item.labels.includes("Chef's Special") || item.labels.includes('Must Try'),
        spice_level: item.spice_level,
        labels: item.labels,
      };
      await addMenuItem(formData);
    } finally {
      setAddingId(null);
    }
  };

  // Customize & add
  const handleCustomize = async (item: CatalogItem) => {
    const categoryId = await ensureCategory(item.categoryName);
    const formData: MenuItemFormData = {
      name: item.name,
      description: item.description,
      price: item.price,
      discounted_price: null,
      category_id: categoryId,
      image_url: item.image_url,
      food_type: item.food_type,
      is_available: true,
      is_featured: item.labels.includes("Chef's Special") || item.labels.includes('Must Try'),
      spice_level: item.spice_level,
      labels: item.labels,
    };
    onSelectForCustomize(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl border flex flex-col shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-start justify-between gap-4"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="p-1.5 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <Sparkles size={18} />
              </span>
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Pre-Built Cafe Library
              </h2>
            </div>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              Add signature Cafe Choco Craze beverages, shakes, crispy bites, and waffles in <strong>1 click</strong>, or customize their price first.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters & Search */}
        <div
          className="p-4 sm:p-5 border-b space-y-3 shrink-0"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by dish name (e.g., Butter Chicken, Biryani, Pizza, Lassi)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Diet Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-black/5 dark:bg-white/5 shrink-0" style={{ borderColor: 'var(--border-default)' }}>
              <button
                type="button"
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  dietFilter === 'all'
                    ? 'bg-white dark:bg-zinc-800 shadow-sm text-foreground'
                    : 'text-zinc-500 hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietFilter('veg')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-zinc-500 hover:text-foreground'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Pure Veg
              </button>
              <button
                type="button"
                onClick={() => setDietFilter('nonveg')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  dietFilter === 'nonveg'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-bold border border-red-500/30'
                    : 'text-zinc-500 hover:text-foreground'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {catalogCategories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
                  style={{
                    backgroundColor: active ? 'var(--accent)' : 'transparent',
                    color: active ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border-default)'}`,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat size={40} className="mx-auto mb-3 opacity-30" />
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                No dishes found
              </h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Try searching for something else or clear the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const isAlreadyOnMenu = existingDishNames.has(item.name.trim().toLowerCase());
                const isAdding = addingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg group relative"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: isAlreadyOnMenu ? 'var(--accent)' : 'var(--border-default)',
                    }}
                  >
                    <div>
                      {/* Image + Badges */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-zinc-200 dark:bg-zinc-800">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Diet Icon */}
                        <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-1 rounded-md shadow-sm border border-black/10 dark:border-white/10">
                          <span
                            className={`block w-2.5 h-2.5 rounded-full ${
                              item.food_type === 'veg' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                        </div>

                        {/* Spice Badge */}
                        {item.spice_level !== 'none' && (
                          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1">
                            <Flame size={10} className="text-amber-400" />
                            <span className="capitalize">{item.spice_level}</span>
                          </div>
                        )}

                        {/* Already added tag */}
                        {isAlreadyOnMenu && (
                          <div className="absolute bottom-2.5 left-2.5 bg-emerald-600/95 text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-md">
                            <Check size={12} />
                            <span>Already on Menu</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className="font-bold text-sm leading-snug line-clamp-1"
                          style={{ color: 'var(--text-primary)' }}
                          title={item.name}
                        >
                          {item.name}
                        </h4>
                        <span
                          className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                        >
                          {formatINR(item.price)}
                        </span>
                      </div>

                      <span
                        className="text-[11px] font-medium block mb-1.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {item.categoryName}
                      </span>

                      <p
                        className="text-xs line-clamp-2 leading-relaxed mb-3"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t mt-1" style={{ borderColor: 'var(--border-default)' }}>
                      <button
                        type="button"
                        onClick={() => handleCustomize(item)}
                        className="flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-1.5"
                        style={{
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <SlidersHorizontal size={13} />
                        <span>Customize</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSingleClickAdd(item)}
                        disabled={isAdding}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                        style={{
                          backgroundColor: isAlreadyOnMenu ? 'var(--bg-secondary)' : 'var(--accent)',
                          color: isAlreadyOnMenu ? 'var(--text-primary)' : 'var(--text-inverse)',
                          border: isAlreadyOnMenu ? '1px solid var(--border-default)' : 'none',
                        }}
                      >
                        {isAdding ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isAlreadyOnMenu ? (
                          <>
                            <Plus size={13} />
                            <span>Add Again</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            <span>1-Click Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          className="p-3 sm:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-muted)',
          }}
        >
          <span>
            Showing {filteredItems.length} curated dishes • All include high-res images and descriptions
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
