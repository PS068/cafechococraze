import { MapPin, Clock, ChefHat } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function RestaurantHero() {
  const { restaurant } = useData();

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '420px', maxHeight: '520px' }}
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
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, #1a0f00 0%, #2d1810 30%, #3d2519 60%, #1a0f00 100%)',
            }}
          />
        )}
        <div className="hero-gradient absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center h-full" style={{ minHeight: '420px' }}>
        <div className="pt-24 pb-12 md:pt-28 md:pb-16 max-w-2xl">
          {/* Cuisine badge */}
          {restaurant.cuisine_type && (
            <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
              <ChefHat size={16} className="text-amber-400" />
              <span className="text-amber-300 text-xs font-medium tracking-widest uppercase">
                {restaurant.cuisine_type}
              </span>
            </div>
          )}

          {/* Restaurant name */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in-up"
            style={{ fontFamily: 'var(--font-display)', animationDelay: '0.1s' }}
          >
            {restaurant.name}
          </h1>

          {/* Tagline */}
          {restaurant.tagline && (
            <p
              className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {restaurant.tagline}
            </p>
          )}

          {/* Info pills */}
          <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {restaurant.address && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <MapPin size={14} className="text-amber-400" />
                <span className="text-white/90 text-sm">{restaurant.address.split(',')[0]}</span>
              </div>
            )}
            {restaurant.opening_hours && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <Clock size={14} className="text-amber-400" />
                <span className="text-white/90 text-sm">{restaurant.opening_hours}</span>
              </div>
            )}
          </div>
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
