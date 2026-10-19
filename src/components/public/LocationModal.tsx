import { useEffect } from 'react';
import { MapPin, ExternalLink, X, Navigation } from 'lucide-react';

export const CAFE_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/aAXvm39A9ifWXnJU6?g_st=iw';
export const CAFE_FULL_ADDRESS = '100ft Road, Nishant Colony, Opposite to Military Canteen, Sangli, Maharashtra';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOpenMaps = () => {
    window.open(CAFE_GOOGLE_MAPS_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div
        className="w-full max-w-md rounded-3xl border p-6 sm:p-7 shadow-2xl animate-scale-up relative"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer hover:opacity-80"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
          aria-label="Close location dialog"
        >
          <X size={18} />
        </button>

        {/* Icon & Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-4 ring-amber-500/10"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
          >
            <Navigation size={30} className="animate-pulse" />
          </div>

          <span
            className="text-xs font-bold uppercase tracking-[0.22em] mb-1.5"
            style={{ color: 'var(--accent)' }}
          >
            Google Maps Navigation
          </span>

          <h3
            id="location-modal-title"
            className="text-xl sm:text-2xl font-bold tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Open Cafe Choco Craze?
          </h3>

          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            Would you like turn-by-turn directions to our cafe in Google Maps?
          </p>

          {/* Address card */}
          <div
            className="w-full text-left p-4 rounded-2xl border mb-6 flex items-start gap-3"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div
              className="p-2 rounded-xl shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                Cafe Address
              </p>
              <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                {CAFE_FULL_ADDRESS}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <button
              onClick={handleOpenMaps}
              className="flex-1 py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-inverse)',
              }}
            >
              <ExternalLink size={16} />
              <span>Get Directions</span>
            </button>

            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-semibold text-sm border transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
