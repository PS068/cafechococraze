import { useEffect } from 'react';
import { X, Flame, Star, Award, CheckCircle, ImageOff } from 'lucide-react';
import type { MenuItem, Category } from '../../types';

interface DishDetailModalProps {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
}

export default function DishDetailModal({ item, categories, onClose }: DishDetailModalProps) {
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [item]);

  if (!item) return null;

  const categoryName = categories.find((c) => c.id === item.category_id)?.name || 'Specialty';
  const hasDiscount = item.discounted_price !== null && item.discounted_price < item.price;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dish Image Banner */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black/10">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
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
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-md"
            aria-label="Close details"
          >
            <X size={18} />
          </button>

          {/* Labels */}
          {item.labels && item.labels.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {item.labels.map((label) => (
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
        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              {categoryName}
            </span>

            {/* Veg/Non-Veg Pill */}
            {item.food_type !== 'none' && (
              <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                <span className={`food-type-badge ${item.food_type === 'veg' ? 'veg' : 'nonveg'}`} />
                <span>{item.food_type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</span>
              </div>
            )}
          </div>

          {/* Dish Name */}
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {item.name}
          </h2>

          {/* Price & Spice row */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--accent)' }}>
                ₹{hasDiscount ? item.discounted_price : item.price}
              </span>
              {hasDiscount && (
                <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                  ₹{item.price}
                </span>
              )}
            </div>

            {/* Spice Level details */}
            {item.spice_level && item.spice_level !== 'none' && (
              <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-orange-500/10 text-orange-600">
                <Flame size={14} />
                <span className="capitalize">{item.spice_level.replace('_', ' ')} Spice</span>
              </div>
            )}
          </div>

          {/* Full Description */}
          {item.description ? (
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              {item.description}
            </p>
          ) : (
            <p className="text-sm italic mb-6" style={{ color: 'var(--text-muted)' }}>
              A signature delicacy carefully prepared by our culinary team with authentic spices.
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
