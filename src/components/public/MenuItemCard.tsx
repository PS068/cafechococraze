import { useState } from 'react';
import { Flame, Star, Award, ImageOff, ArrowUpRight } from 'lucide-react';
import type { MenuItem } from '../../types';
import { formatINR } from '../../lib/formatters';
import { formatSizeLabel, sanitizeCulinaryLabels } from '../../lib/menuVariants';

interface MenuItemCardProps {
  item: MenuItem;
  variants?: MenuItem[];
  onSelect?: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, variants, onSelect }: MenuItemCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(item.id);
  const [imgError, setImgError] = useState(false);

  const hasVariants = Boolean(variants && variants.length > 1);
  const activeItem = variants?.find((v) => v.id === selectedVariantId) || item;
  const displayName = hasVariants ? item.name.replace(/\s*\[.*?\]$/, '') : item.name;
  const hasDiscount = activeItem.discounted_price !== null && activeItem.discounted_price < activeItem.price;
  const visibleLabels = sanitizeCulinaryLabels(activeItem.labels);

  const hasImage = Boolean(item.image_url && !imgError);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(activeItem)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(activeItem);
        }
      }}
      className="group text-left rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer select-none flex flex-col justify-between w-full h-full"
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
      <div className="w-full">
        {/* Image (only rendered when image exists, matching ps-resto) */}
        {hasImage && (
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />

            {/* Labels overlay */}
            {visibleLabels.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                {visibleLabels.map((label) => (
                  <span
                    key={label}
                    className="px-2.5 py-0.5 text-xs font-semibold rounded-md flex items-center gap-1 shadow-sm"
                    style={{
                      backgroundColor: label === 'Popular' ? 'var(--accent)' : label === 'Spicy' ? '#ef4444' : '#7052a3',
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
              <div className="absolute top-3 right-3 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-sm z-10">
                {Math.round(((item.price - item.discounted_price!) / item.price) * 100)}% OFF
              </div>
            )}

            {/* Unavailable overlay */}
            {!item.is_available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                <span className="text-white font-semibold text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* If no image, show badges here at the top of content */}
            {!hasImage && visibleLabels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {visibleLabels.map((label) => (
                  <span
                    key={label}
                    className="px-2.5 py-0.5 text-xs font-semibold rounded-md flex items-center gap-1 shadow-2xs"
                    style={{
                      backgroundColor: label === 'Popular' ? 'var(--accent)' : label === 'Spicy' ? '#ef4444' : '#7052a3',
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

            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                {activeItem.food_type !== 'none' && (
                  <span className={`food-type-badge shrink-0 ${activeItem.food_type === 'veg' ? 'veg' : 'nonveg'}`} />
                )}
                <h3
                  className="font-bold text-base sm:text-lg leading-snug tracking-tight truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {displayName}
                </h3>
              </div>

              {/* Spice level */}
              {activeItem.spice_level && activeItem.spice_level !== 'none' && (
                <div className="flex items-center gap-0.5 shrink-0 pt-0.5" title={`Spice: ${activeItem.spice_level}`}>
                  {Array.from({
                    length:
                      activeItem.spice_level === 'mild' ? 1 : activeItem.spice_level === 'medium' ? 2 : activeItem.spice_level === 'hot' ? 3 : 4,
                  }).map((_, i) => (
                    <Flame key={i} size={14} className="text-orange-500" />
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {activeItem.description && (
              <p
                className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-3 line-clamp-2"
              >
                {activeItem.description}
              </p>
            )}
          </div>

          {/* Size Pills (when item has multiple sizes) */}
          {hasVariants && (
            <div
              className="mt-2.5 pt-2.5 border-t flex flex-col gap-1.5"
              style={{ borderColor: 'var(--border-subtle)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[11px] font-bold tracking-wider uppercase text-stone-400">
                Portion / Size
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {variants!.map((v) => {
                  const raw = v.name.match(/\[(.*?)\]/)?.[1] || v.name;
                  const label = formatSizeLabel(raw);
                  const isSelected = v.id === activeItem.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariantId(v.id);
                      }}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      style={{
                        backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-hover)',
                        color: isSelected ? '#fff' : 'var(--text-primary)',
                        borderColor: isSelected ? 'var(--accent)' : 'var(--border-default)',
                      }}
                    >
                      <span>{label}</span>
                      <span className="font-normal opacity-90">· {formatINR(v.discounted_price ?? v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price footer */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 flex items-center justify-between border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-baseline gap-2">
          <span
            className="text-lg sm:text-xl font-extrabold tracking-tight"
            style={{ color: 'var(--accent)' }}
          >
            {formatINR(hasDiscount ? activeItem.discounted_price : activeItem.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm line-through text-stone-400">
              {formatINR(activeItem.price)}
            </span>
          )}
        </div>
        <span className="text-xs sm:text-sm font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--accent)' }}>
          Details <ArrowUpRight size={15} />
        </span>
      </div>
    </div>
  );
}
