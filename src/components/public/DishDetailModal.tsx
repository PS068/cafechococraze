import { useEffect, useState } from 'react';
import { X, Flame, Star, Award, CheckCircle, ImageOff } from 'lucide-react';
import type { MenuItem, Category } from '../../types';
import { formatINR } from '../../lib/formatters';
import { formatSizeLabel, sanitizeCulinaryLabels } from '../../lib/menuVariants';

interface DishDetailModalProps {
  item: MenuItem | null;
  categories: Category[];
  allItems?: MenuItem[];
  onClose: () => void;
}

export default function DishDetailModal({ item, categories, allItems, onClose }: DishDetailModalProps) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(item);

  useEffect(() => {
    setActiveItem(item);
  }, [item]);

  useEffect(() => {
    if (activeItem) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeItem, onClose]);

  if (!activeItem) return null;

  const match = activeItem.name.match(/^(.*?)\s*\[(.*?)\]$/);
  const baseName = match ? match[1].trim() : activeItem.name;
  const variants = match && allItems
    ? allItems
        .filter((i) => i.category_id === activeItem.category_id && i.name.toLowerCase().startsWith(baseName.toLowerCase()))
        .sort((a, b) => a.price - b.price)
    : [];

  const categoryName = categories.find((c) => c.id === activeItem.category_id)?.name || 'Specialty';
  const hasDiscount = activeItem.discounted_price !== null && activeItem.discounted_price < activeItem.price;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 modal-overlay animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-[1.75rem] overflow-hidden shadow-2xl animate-fade-in-up border relative"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-detail-title"
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1 rounded-full bg-white/50 absolute top-2.5 left-1/2 -translate-x-1/2 z-20 sm:hidden" />

        {/* Dish Image Banner */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black/10">
          {activeItem.image_url ? (
            <img
              src={activeItem.image_url}
              alt={activeItem.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full img-placeholder flex items-center justify-center">
              <ImageOff size={48} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}

          {/* Close button floating on image */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-md cursor-pointer"
            aria-label="Close details"
          >
            <X size={18} />
          </button>

          {/* Labels */}
          {sanitizeCulinaryLabels(activeItem.labels).length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {sanitizeCulinaryLabels(activeItem.labels).map((label) => (
                <span
                  key={label}
                  className="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm"
                  style={{
                    backgroundColor: label === 'Popular' ? 'var(--accent)' : label === 'Spicy' ? '#ef4444' : '#8b5cf6',
                    color: '#fff',
                  }}
                >
                  {label === 'Popular' && <Star size={12} />}
                  {label === 'Spicy' && <Flame size={12} />}
                  {label === "Chef's Special" && <Award size={12} />}
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              {categoryName}
            </span>

            {/* Veg/Non-Veg Pill */}
            {activeItem.food_type !== 'none' && (
              <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                <span className={`food-type-badge ${activeItem.food_type === 'veg' ? 'veg' : 'nonveg'}`} />
                <span>{activeItem.food_type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</span>
              </div>
            )}
          </div>

          {/* Dish Name */}
          <h2
            id="dish-detail-title"
            className="text-xl sm:text-2xl font-bold mb-2 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {variants.length > 1 ? baseName : activeItem.name}
          </h2>

          {/* Price & Spice row */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--accent)' }}>
                {formatINR(hasDiscount ? activeItem.discounted_price : activeItem.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                  {formatINR(activeItem.price)}
                </span>
              )}
            </div>

            {/* Spice Level details */}
            {activeItem.spice_level && activeItem.spice_level !== 'none' && (
              <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-orange-500/10 text-orange-600">
                <Flame size={14} />
                <span className="capitalize">{activeItem.spice_level.replace('_', ' ')} Spice</span>
              </div>
            )}
          </div>

          {/* Size Variant Switcher (if multiple sizes exist) */}
          {variants.length > 1 && (
            <div
              className="mb-5 p-3.5 rounded-2xl border"
              style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-default)' }}
            >
              <span className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-muted)' }}>
                Select Portion / Size:
              </span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const raw = v.name.match(/\[(.*?)\]/)?.[1] || v.name;
                  const label = formatSizeLabel(raw);
                  const isSelected = v.id === activeItem.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveItem(v)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5"
                      style={{
                        backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-card)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        borderColor: isSelected ? 'var(--accent)' : 'var(--border-default)',
                        boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <span>{label}</span>
                      <span className="opacity-90">· {formatINR(v.discounted_price ?? v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Description */}
          {activeItem.description ? (
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              {activeItem.description}
            </p>
          ) : (
            <p className="text-sm italic mb-6" style={{ color: 'var(--text-muted)' }}>
              No description has been added for this item yet.
            </p>
          )}

          {/* Helpful Customer Notice */}
          <div
            className="p-3.5 rounded-2xl border text-xs flex items-center gap-2.5"
            style={{
              backgroundColor: 'var(--bg-hover)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <CheckCircle size={16} className="text-amber-500 shrink-0" />
            <span>
              Please inform your server of any food allergies or dietary preferences when placing your order at the table.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
