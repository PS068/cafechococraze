import { MapPin, Sparkles, Coffee, Heart, Calendar, ArrowUpRight } from 'lucide-react';
import { CAFE_FULL_ADDRESS } from './LocationModal';

interface AboutSectionProps {
  onOpenLocation: () => void;
}

export default function AboutSection({ onOpenLocation }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="py-16 sm:py-24 border-t transition-colors duration-300 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Background soft ambient glows */}
      <div
        className="absolute top-1/4 -left-40 w-96 h-96 rounded-full opacity-20 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-10 -right-40 w-96 h-96 rounded-full opacity-15 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--accent)',
            }}
          >
            <Sparkles size={14} />
            <span>Our Journey · Established 2019</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            The Heart Behind the Craze
          </h2>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Every sip, shake, and crispy bite tells the story of an uncompromising dedication to flavor and warmth.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Cafe Atmosphere & Quality Commitment Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className="w-full max-w-sm rounded-3xl p-4 sm:p-5 border shadow-xl relative group transition-transform duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              {/* Photo Frame */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md ring-1 ring-black/10 bg-amber-50">
                <img
                  src="/satyajeet-maskin.jpg"
                  alt="Franchise Owner - Cafe Choco Craze"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {/* Franchise Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                  <Coffee size={13} className="text-amber-400" />
                  <span>Authorized Franchise</span>
                </div>
              </div>

              {/* Cafe Information */}
              <div className="pt-5 pb-2 text-center">
                <span
                  className="text-xs font-bold tracking-widest uppercase mb-1 block"
                  style={{ color: 'var(--accent)' }}
                >
                  Authorized Franchise Outlet
                </span>
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  Cafe Choco Craze Sangli
                </h3>
                <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  100ft Road, Nishant Colony, Sangli
                </p>

                <p
                  className="mt-3.5 text-xs sm:text-sm italic leading-relaxed px-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  &ldquo;Bringing the beloved Cafe Choco Craze signature thick cold coffees, chocolicks, and cafe bites to food lovers in Sangli.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Cafe Story & Address Card */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                >
                  <Coffee size={20} />
                </div>
                <div>
                  <h4
                    className="text-lg sm:text-xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    Serving Sangli With Love
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Your favorite hangout for cold coffee & quick bites
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  As an <strong>authorized franchise outlet</strong> of the popular <strong>Cafe Choco Craze</strong> brand, our Sangli café is committed to bringing you the exact signature taste, quality, and comforting café experience that thousands love across Maharashtra.
                </p>
                <p>
                  From our signature <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>Crunchy Frolic Cold Coffees</strong> and decadent <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>Chocolicks</strong> to crispy seasoned fries, cheesy pizzas, grilled sandwiches, and sweet sizzling desserts, every item is prepared fresh to order using the brand's authentic recipes and premium ingredients.
                </p>
              </div>

              {/* Highlights pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="p-3 rounded-2xl border text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                  <span className="block text-xl font-bold" style={{ color: 'var(--accent)' }}>Original</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Brand Recipes</span>
                </div>
                <div className="p-3 rounded-2xl border text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                  <span className="block text-xl font-bold" style={{ color: 'var(--accent)' }}>70+</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Menu Items</span>
                </div>
                <div className="p-3 rounded-2xl border text-center col-span-2 sm:col-span-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                  <span className="block text-xl font-bold flex items-center justify-center gap-1" style={{ color: 'var(--accent)' }}>
                    <Heart size={16} fill="currentColor" /> 100%
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Pure Veg &amp; Fresh</span>
                </div>
              </div>
            </div>

            {/* Address & Direction Card */}
            <div
              onClick={onOpenLocation}
              className="rounded-3xl p-6 sm:p-7 border shadow-md transition-all duration-300 hover:shadow-lg hover:border-amber-400/50 cursor-pointer group"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-default)',
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenLocation(); }}
              aria-label="Direct to Cafe Choco Craze on Google Maps"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className="p-3 rounded-2xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-xs"
                    style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--accent)' }}>
                      Cafe Location &amp; Address
                    </span>
                    <p
                      className="text-base sm:text-lg font-bold leading-snug"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                    >
                      {CAFE_FULL_ADDRESS}
                    </p>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      Touch or click to get direct turn-by-turn navigation in Google Maps
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group-hover:gap-2 shadow-xs"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    <span>Get Directions</span>
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
