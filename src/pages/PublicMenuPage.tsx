import { useState } from 'react';
import Navbar from '../components/public/Navbar';
import RestaurantHero from '../components/public/RestaurantHero';
import MenuSearch from '../components/public/MenuSearch';
import CategoryTabs from '../components/public/CategoryTabs';
import FeaturedItems from '../components/public/FeaturedItems';
import MenuGrid from '../components/public/MenuGrid';
import Footer from '../components/public/Footer';
import AboutSection from '../components/public/AboutSection';
import LocationModal from '../components/public/LocationModal';
import DishDetailModal from '../components/public/DishDetailModal';
import WeeklyScheduleModal from '../components/public/WeeklyScheduleModal';
import { useData } from '../context/DataContext';
import type { MenuItem } from '../types';
import { Flame, Utensils, Sparkles, ArrowDown, Tag, AlertTriangle } from 'lucide-react';

export default function PublicMenuPage() {
  const { restaurant, categories, menuItems, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg' | 'spicy'>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const isStoreOpen = (restaurant.theme_preferences as any)?.isOpen !== false;
  const pauseNotice = (restaurant.theme_preferences as any)?.pauseNotice as string | undefined;

  const featuredItems = menuItems.filter((item) => item.is_featured && item.is_available);
  const featuredItemIds = new Set(featuredItems.map((item) => item.id));
  const displayedGridItems =
    !searchQuery && !activeCategory && dietaryFilter === 'all'
      ? menuItems.filter((item) => !featuredItemIds.has(item.id))
      : menuItems;

  const sortedCategories = [...categories].sort((a, b) => {
    const isACombo = /combo/i.test(a.name);
    const isBCombo = /combo/i.test(b.name);
    if (isACombo && !isBCombo) return -1;
    if (!isACombo && isBCombo) return 1;

    const isAPizza = /pizza/i.test(a.name);
    const isBPizza = /pizza/i.test(b.name);
    if (isAPizza && !isBPizza) return -1;
    if (!isAPizza && isBPizza) return 1;

    return a.display_order - b.display_order;
  });
  const comboCategory = sortedCategories.find((c) => /combo|offer|deal/i.test(c.name));
  const hasCombos = Boolean(comboCategory || menuItems.some((i) => /combo/i.test(i.name)));
  const hasDietarySignals = menuItems.some(
    (item) => item.food_type !== 'none' || (item.spice_level && item.spice_level !== 'none') || item.labels.includes('Spicy')
  );

  const handleComboClick = () => {
    setDietaryFilter('all');
    if (comboCategory) {
      setSearchQuery('');
      setActiveCategory(comboCategory.id);
    } else {
      setActiveCategory(null);
      setSearchQuery('Combo');
    }

    setTimeout(() => {
      const target = document.getElementById('menu-catalog') || document.getElementById('menu');
      if (target) {
        const navOffset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const targetRect = target.getBoundingClientRect().top;
        const targetPosition = targetRect - bodyRect - navOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    }, 120);
  };

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
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Red Alert Banner: Store Temporarily Closed / Kitchen Paused */}
      {!isStoreOpen && (
        <div
          className="sticky top-[4.75rem] z-40 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white px-4 py-3 sm:px-6 shadow-lg border-b border-red-700 animate-fade-in"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <AlertTriangle size={20} className="shrink-0 text-amber-200" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                  Store Temporarily Closed / Kitchen Paused
                </p>
                <p className="text-xs text-white/95 font-medium mt-0.5">
                  {pauseNotice || 'We are currently not accepting new orders. Please check back shortly or call cafe directly.'}
                </p>
              </div>
            </div>

            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-red-600 hover:bg-white/90 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
              >
                Call: {restaurant.phone}
              </a>
            )}
          </div>
        </div>
      )}

      <RestaurantHero
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenSchedule={() => setIsScheduleModalOpen(true)}
      />

      {/* Special Combo Offers Bar */}
      {hasCombos && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-6">
          <button
            type="button"
            onClick={handleComboClick}
            className="w-full text-left rounded-xl sm:rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group flex items-center justify-between gap-2.5 sm:gap-3.5 p-2.5 sm:px-5 sm:py-4 shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
              boxShadow: 'var(--shadow-card)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
              {/* Gift/Offer Icon Badge */}
              <div
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-light)',
                }}
              >
                <Tag size={16} className="sm:w-5 sm:h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3
                    className="font-bold text-xs sm:text-lg leading-snug tracking-tight truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Special Combo Offers
                  </h3>
                  <span
                    className="text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
                    style={{
                      backgroundColor: 'var(--accent-bg)',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent-light)',
                    }}
                  >
                    Save More
                  </span>
                </div>
                <p
                  className="text-[11px] sm:text-sm mt-0.5 truncate hidden xs:block sm:block"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Pairings of burgers, pizzas, thick shakes &amp; cold coffees · Bundles from ₹129
                </p>
              </div>
            </div>

            {/* View Combos Action */}
            <div className="flex items-center justify-end shrink-0">
              <span
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-semibold transition-all group-hover:gap-2 shrink-0 shadow-2xs whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-inverse)',
                }}
              >
                <span>View Combos</span>
                <ArrowDown size={12} className="sm:w-3.5 sm:h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Menu Main Section */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-12 flex-1 w-full">
        <div className="mb-5 sm:mb-10">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3" style={{ color: 'var(--accent)' }}>
            <Sparkles size={14} className="sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase">The menu</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2.5 sm:gap-3">
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Choose your indulgence
              </h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-base md:text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                Signature thick cold coffees, chocolicks, handcrafted shakes, crispy fries &amp; cafe delights.
              </p>
            </div>
            <div className="text-[11px] sm:text-sm font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border shrink-0 w-fit" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
              {menuItems.filter((item) => item.is_available).length} items · prices in INR
            </div>
          </div>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div className="sticky top-14 sm:top-[4.5rem] z-30 w-full py-2.5 sm:py-3.5 mb-6 sm:mb-8 border-y backdrop-blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 88%, transparent)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <MenuSearch value={searchQuery} onChange={setSearchQuery} />

          {/* Dietary quick toggles */}
          {hasDietarySignals && <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 w-full max-w-full">
            <button
              onClick={() => setDietaryFilter('all')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap cursor-pointer shadow-2xs"
              style={{
                backgroundColor: dietaryFilter === 'all' ? 'var(--accent)' : 'var(--bg-card)',
                color: dietaryFilter === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                borderColor: dietaryFilter === 'all' ? 'var(--accent)' : 'var(--border-default)',
              }}
            >
              <Utensils size={14} />
              <span>All Types</span>
            </button>

            <button
              onClick={() => setDietaryFilter('veg')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap cursor-pointer shadow-2xs"
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
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap cursor-pointer shadow-2xs"
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
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap cursor-pointer shadow-2xs"
              style={{
                backgroundColor: dietaryFilter === 'spicy' ? '#f97316' : 'var(--bg-card)',
                color: dietaryFilter === 'spicy' ? '#fff' : 'var(--text-secondary)',
                borderColor: dietaryFilter === 'spicy' ? '#f97316' : 'var(--border-default)',
              }}
            >
              <Flame size={14} />
              <span>Spicy</span>
            </button>
          </div>}
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
        <div id="menu-catalog" className="scroll-mt-28">
          <MenuGrid
            items={displayedGridItems}
            categories={sortedCategories}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            dietaryFilter={dietaryFilter}
            onSelectItem={setSelectedDish}
          />
        </div>
      </main>

      {/* About Cafe & Founder Section */}
      <AboutSection onOpenLocation={() => setIsLocationModalOpen(true)} />

      {/* Dish Detailed View Modal */}
      <DishDetailModal
        item={selectedDish}
        categories={sortedCategories}
        allItems={menuItems}
        onClose={() => setSelectedDish(null)}
      />

      {/* Location / Google Maps Direction Prompt Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Google-Style Weekly Schedule Modal */}
      <WeeklyScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        phone={restaurant.phone || '9850568355'}
      />

      <Footer
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenSchedule={() => setIsScheduleModalOpen(true)}
      />
    </div>
  );
}
