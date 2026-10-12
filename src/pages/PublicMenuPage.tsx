import { useState } from 'react';
import Navbar from '../components/public/Navbar';
import RestaurantHero from '../components/public/RestaurantHero';
import MenuSearch from '../components/public/MenuSearch';
import CategoryTabs from '../components/public/CategoryTabs';
import FeaturedItems from '../components/public/FeaturedItems';
import MenuGrid from '../components/public/MenuGrid';
import Footer from '../components/public/Footer';
import DishDetailModal from '../components/public/DishDetailModal';
import { useData } from '../context/DataContext';
import type { MenuItem } from '../types';
import { Flame, Leaf, Utensils } from 'lucide-react';

export default function PublicMenuPage() {
  const { restaurant, categories, menuItems, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg' | 'spicy'>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const featuredItems = menuItems.filter((item) => item.is_featured && item.is_available);
  const sortedCategories = [...categories].sort((a, b) => a.display_order - b.display_order);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Loading {restaurant.name} menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <RestaurantHero />

      {/* Menu Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Search & Dietary Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <MenuSearch value={searchQuery} onChange={setSearchQuery} />

          {/* Dietary quick toggles */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setDietaryFilter('all')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap"
              style={{
                backgroundColor: dietaryFilter === 'all' ? 'var(--accent)' : 'var(--bg-card)',
                color: dietaryFilter === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                borderColor: dietaryFilter === 'all' ? 'var(--accent)' : 'var(--border-default)',
              }}
            >
              <Utensils size={13} />
              <span>All Types</span>
            </button>

            <button
              onClick={() => setDietaryFilter('veg')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap"
              style={{
                backgroundColor: dietaryFilter === 'veg' ? '#22c55e' : 'var(--bg-card)',
                color: dietaryFilter === 'veg' ? '#fff' : 'var(--text-secondary)',
                borderColor: dietaryFilter === 'veg' ? '#22c55e' : 'var(--border-default)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Pure Veg</span>
            </button>

            <button
              onClick={() => setDietaryFilter('nonveg')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap"
              style={{
                backgroundColor: dietaryFilter === 'nonveg' ? '#ef4444' : 'var(--bg-card)',
                color: dietaryFilter === 'nonveg' ? '#fff' : 'var(--text-secondary)',
                borderColor: dietaryFilter === 'nonveg' ? '#ef4444' : 'var(--border-default)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Non-Veg</span>
            </button>

            <button
              onClick={() => setDietaryFilter('spicy')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap"
              style={{
                backgroundColor: dietaryFilter === 'spicy' ? '#f97316' : 'var(--bg-card)',
                color: dietaryFilter === 'spicy' ? '#fff' : 'var(--text-secondary)',
                borderColor: dietaryFilter === 'spicy' ? '#f97316' : 'var(--border-default)',
              }}
            >
              <Flame size={13} />
              <span>Spicy</span>
            </button>
          </div>
        </div>

        {/* Category horizontal tabs */}
        <div className="mb-10">
          <CategoryTabs
            categories={sortedCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Chef's recommendations (only shown when not searching and category is All) */}
        {!searchQuery && !activeCategory && dietaryFilter === 'all' && (
          <FeaturedItems items={featuredItems} onSelectItem={setSelectedDish} />
        )}

        {/* Full Menu Grid */}
        <MenuGrid
          items={menuItems}
          categories={sortedCategories}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          dietaryFilter={dietaryFilter}
          onSelectItem={setSelectedDish}
        />
      </main>

      {/* Dish Detailed View Modal */}
      <DishDetailModal
        item={selectedDish}
        categories={sortedCategories}
        onClose={() => setSelectedDish(null)}
      />

      <Footer />
    </div>
  );
}
