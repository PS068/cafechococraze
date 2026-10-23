import { Building2, MapPin, Phone, ExternalLink, CheckCircle2, Sparkles, Navigation, Globe } from 'lucide-react';
import { CAFE_FRANCHISES, FRANCHISE_INQUIRY } from '../../data/franchiseData';

interface FranchisesSectionProps {
  onOpenSangliDirections?: () => void;
}

export default function FranchisesSection({ onOpenSangliDirections }: FranchisesSectionProps) {
  const currentBranch = CAFE_FRANCHISES.find((f) => f.isCurrent);
  const otherBranches = CAFE_FRANCHISES.filter((f) => !f.isCurrent);

  return (
    <section
      id="franchises"
      className="py-16 sm:py-24 border-t transition-colors duration-300 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-10 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-10 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none blur-3xl"
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
            <Building2 size={14} />
            <span>Multi-City Franchise Network</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Cafe Choco Craze Outlets &amp; Franchises
          </h2>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Serving Maharashtra's finest cold coffees and shakes. You are currently viewing the dedicated digital menu for our <span className="font-semibold text-amber-500">Sangli (100ft Road)</span> outlet.
          </p>
        </div>

        {/* Featured Current Outlet: Cafe Choco Craze Sangli */}
        {currentBranch && (
          <div
            className="w-full rounded-3xl p-6 sm:p-8 border mb-10 shadow-xl relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--accent)',
              borderWidth: '2px',
            }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/15 to-transparent h-full w-1/2 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-amber-400/30"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                >
                  <MapPin size={28} className="animate-bounce" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Current Webpage
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      Sangli City Hub
                    </span>
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    Cafe Choco Craze — Sangli
                  </h3>

                  <p className="text-sm sm:text-base flex items-center gap-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={16} className="text-amber-500 shrink-0" />
                    <span>{currentBranch.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span>🕒 {currentBranch.hours}</span>
                    <span>📞 {currentBranch.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {onOpenSangliDirections && (
                  <button
                    onClick={onOpenSangliDirections}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                  >
                    <Navigation size={16} />
                    <span>Open in Maps</span>
                  </button>
                )}
                <a
                  href={`tel:${currentBranch.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                >
                  <Phone size={16} />
                  <span>Call Sangli Store</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Other Franchise Outlets Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Other Cafe Choco Craze Outlets
            </h3>
            <span className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              Maharashtra Network
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherBranches.map((branch) => (
              <div
                key={branch.id}
                className="p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {branch.city}
                  </span>
                  {branch.badge && (
                    <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                      {branch.badge}
                    </span>
                  )}
                </div>

                <h4
                  className="text-lg font-bold mb-1.5"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  {branch.branchName}
                </h4>

                <p className="text-xs sm:text-sm line-clamp-2 mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {branch.address}
                </p>

                <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
                  <span>{branch.hours}</span>
                  {branch.mapsUrl && (
                    <a
                      href={branch.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span>Maps</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Franchise Inquiry Card */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-amber-500 mb-2">
                <Sparkles size={14} />
                <span>Business Opportunity</span>
              </div>
              <h3
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Interested in a Cafe Choco Craze Franchise?
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Partner with {FRANCHISE_INQUIRY.brand} — established in {FRANCHISE_INQUIRY.established}. Low capital investment, high profit margins, proven recipes, and continuous operational support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href={`https://wa.me/919850568355?text=${encodeURIComponent('Hello Cafe Choco Craze, I am interested in franchise opportunity.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95 text-white"
                style={{ backgroundColor: '#25D366' }}
              >
                <span>WhatsApp Inquiry</span>
              </a>
              <a
                href={`tel:${FRANCHISE_INQUIRY.phone.replace(/[^0-9]/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              >
                <Phone size={15} />
                <span>{FRANCHISE_INQUIRY.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
