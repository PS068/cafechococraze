import { MapPin, Clock, ArrowDown, Sparkles, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getCurrentOpenStatus, getCalendarHolidayNotice } from '../../lib/scheduleData';

interface RestaurantHeroProps {
  onOpenLocation?: () => void;
  onOpenSchedule?: () => void;
}

export default function RestaurantHero({ onOpenLocation, onOpenSchedule }: RestaurantHeroProps) {
  const { restaurant } = useData();
  const status = getCurrentOpenStatus();
  const holiday = getCalendarHolidayNotice();
  const isStoreOpen = (restaurant.theme_preferences as any)?.isOpen !== false;

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '430px', maxHeight: '570px' }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {restaurant.banner_url ? (
          <img
            src={restaurant.banner_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="w-full h-full hero-glow" />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
          </>
        )}
        <div className="hero-gradient absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full" style={{ minHeight: '480px' }}>
        <div className="pt-28 pb-16 md:pt-36 md:pb-24 max-w-3xl">
          {/* Cafe Identity Badge with Logo */}
          <div className="flex items-center gap-3.5 mb-5 animate-fade-in-up">
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-contain p-1 ring-2 ring-white/30 shadow-2xl bg-white shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-300" />
                <span className="text-amber-200 text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase">
                  Digital Menu · Cafe Choco Craze
                </span>
              </div>
              <p className="text-white/75 text-xs sm:text-sm mt-0.5 font-medium">Signature Shakes, Frolic Coffees &amp; Cafe Bites</p>
            </div>
          </div>

          {/* Restaurant name */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-[1.04] tracking-tight animate-fade-in-up"
            style={{ fontFamily: 'var(--font-display)', animationDelay: '0.1s' }}
          >
            {restaurant.name}
          </h1>

          {/* Tagline */}
          {restaurant.tagline ? (
            <p
              className="text-base sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {restaurant.tagline}
            </p>
          ) : (
            <p className="text-base sm:text-xl md:text-2xl text-white/80 mb-8 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              A considered collection of artisan pizzas, indulgent blends, shakes and cold coffees.
            </p>
          )}

          {/* Info pills */}
          <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {restaurant.address && (
              <button
                type="button"
                onClick={onOpenLocation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/20 transition-all cursor-pointer group shadow-sm text-left"
                title="Touch for directions to Cafe Choco Craze on Google Maps"
                aria-label="Touch for directions to Cafe Choco Craze on Google Maps"
              >
                <MapPin size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-white text-sm sm:text-base font-medium">
                  {restaurant.address.split(',')[0]} · Directions ↗
                </span>
              </button>
            )}
            {restaurant.opening_hours && (
              <button
                type="button"
                onClick={onOpenSchedule}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/20 transition-all cursor-pointer group shadow-sm text-left"
                title="Click to view weekly schedule & holiday hours"
                aria-label="Click to view weekly schedule & holiday hours"
              >
                <Clock size={16} className="text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white text-sm sm:text-base font-medium">
                    {restaurant.opening_hours}
                  </span>
                  {!isStoreOpen ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap bg-red-500/30 text-red-200 border border-red-400/40">
                      ● Temporarily Closed
                    </span>
                  ) : holiday.hasNotice ? (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400/40 whitespace-nowrap">
                      ⚠️ {holiday.holidayName} · Hours might differ
                    </span>
                  ) : (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: status.isOpen ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                        color: status.isOpen ? '#86efac' : '#fca5a5',
                      }}
                    >
                      ● {status.statusLabel}
                    </span>
                  )}
                </div>
                <ChevronDown size={14} className="text-white/70 group-hover:translate-y-0.5 transition-transform shrink-0" />
              </button>
            )}
          </div>
          <button
            onClick={() => document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="mt-8 inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-white/90 hover:text-white transition-colors animate-fade-in-up cursor-pointer"
            style={{ animationDelay: '0.4s' }}
          >
            Explore the menu <ArrowDown size={17} />
          </button>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 h-8">
        <svg viewBox="0 0 1440 32" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,0 C480,32 960,32 1440,0 L1440,32 L0,32 Z"
            style={{ fill: 'var(--bg-primary)' }}
          />
        </svg>
      </div>
    </section>
  );
}
