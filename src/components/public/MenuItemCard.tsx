import { useState } from 'react';
import { Flame, Star, Award, ImageOff } from 'lucide-react';
import type { MenuItem } from '../../types';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasDiscount = item.discounted_price !== null && item.discounted_price < item.price;

  return (
    <div
      onClick={() => onSelect?.(item)}
      className="group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      <div>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.image_url && !imgError ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full img-placeholder flex items-center justify-center"
            >
              <ImageOff size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}

          {/* Labels */}
          {item.labels && item.labels.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {item.labels.map((label) => (
                <span
                  key={label}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm"
                  style={{
                    backgroundColor: label === 'Popular' ? 'var(--accent)' : label === 'Spicy' ? '#ef4444' : '#8b5cf6',
                    color: '#fff',
                  }}
                >
                  {label === 'Popular' && <Star size={11} />}
                  {label === 'Spicy' && <Flame size={11} />}
                  {label === "Chef's Special" && <Award size={11} />}
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-green-500 text-white shadow-sm">
              {Math.round(((item.price - item.discounted_price!) / item.price) * 100)}% OFF
            </div>
          )}

          {/* Unavailable overlay */}
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {/* Food type badge */}
              {item.food_type !== 'none' && (
                <span className={`food-type-badge ${item.food_type === 'veg' ? 'veg' : 'nonveg'}`} />
              )}
              <h3
                className="font-semibold text-base leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                {item.name}
              </h3>
            </div>

            {/* Spice level */}
            {item.spice_level && item.spice_level !== 'none' && (
              <div className="flex items-center gap-0.5 shrink-0" title={`Spice: ${item.spice_level}`}>
                {Array.from({
                  length:
                    item.spice_level === 'mild' ? 1 : item.spice_level === 'medium' ? 2 : item.spice_level === 'hot' ? 3 : 4,
                }).map((_, i) => (
                  <Flame key={i} size={12} className="text-orange-500" />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p
              className="text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Price footer */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-transparent">
        <div className="flex items-baseline gap-2">
          <span
            className="text-lg font-bold"
            style={{ color: 'var(--accent)' }}
          >
            ₹{hasDiscount ? item.discounted_price : item.price}
          </span>
          {hasDiscount && (
            <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>
              ₹{item.price}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium transition-opacity opacity-0 group-hover:opacity-100" style={{ color: 'var(--accent)' }}>
          View Details →
        </span>
      </div>
    </div>
  );
}
