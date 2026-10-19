import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '../common/SocialIcons';
import { useData } from '../../context/DataContext';

interface FooterProps {
  onOpenLocation?: () => void;
  onOpenSchedule?: () => void;
}

export default function Footer({ onOpenLocation, onOpenSchedule }: FooterProps) {
  const { restaurant } = useData();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t mt-20"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {restaurant.logo_url ? (
                <img src={restaurant.logo_url} alt={restaurant.name} className="h-10 w-10 rounded-xl object-cover ring-1 ring-black/10 bg-white" />
              ) : (
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                >
                  <UtensilsCrossed size={20} />
                </div>
              )}
              <span
                className="text-xl font-semibold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {restaurant.name}
              </span>
            </div>
            {restaurant.description && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                {restaurant.description.slice(0, 150)}{restaurant.description.length > 150 ? '...' : ''}
              </p>
            )}
            {/* Social links */}
            <div className="flex gap-3">
              {restaurant.social_links?.instagram && (
                <a
                  href={restaurant.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                  aria-label="Instagram"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {restaurant.social_links?.facebook && (
                <a
                  href={restaurant.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                  aria-label="Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
              {restaurant.social_links?.twitter && (
                <a
                  href={restaurant.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                  aria-label="Twitter"
                >
                  <TwitterIcon size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Visit & connect
            </h3>
            <div className="space-y-3">
              {restaurant.address && (
                <button
                  type="button"
                  onClick={onOpenLocation}
                  className="flex items-start gap-3 text-left group cursor-pointer"
                  title="Click for directions to Cafe Choco Craze on Google Maps"
                >
                  <MapPin size={16} className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform" style={{ color: 'var(--accent)' }} />
                  <span className="text-sm transition-colors group-hover:underline" style={{ color: 'var(--text-secondary)' }}>
                    {restaurant.address}
                  </span>
                </button>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0" style={{ color: 'var(--accent)' }} />
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {restaurant.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Find your favourite
            </h3>
            {restaurant.opening_hours && (
              <button
                type="button"
                onClick={onOpenSchedule}
                className="flex items-start gap-3 text-left group cursor-pointer"
                title="Click to view weekly schedule & holiday hours"
              >
                <Clock size={16} className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform" style={{ color: 'var(--accent)' }} />
                <div>
                  <span className="text-sm block group-hover:underline" style={{ color: 'var(--text-secondary)' }}>
                    {restaurant.opening_hours}
                  </span>
                  <span className="text-xs font-semibold block mt-1" style={{ color: 'var(--accent)' }}>
                    View Weekly Schedule ↗
                  </span>
                </div>
              </button>
            )}
            {!restaurant.opening_hours && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Browse the full beverage menu above and ask the cafe team about today’s availability.
              </p>
            )}
          </div>
        </div>

        {/* Copyright & Staff Portal Link */}
        <div
          className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {year} {restaurant.name}. All rights reserved.
          </p>

          <Link
            to="/admin/login"
            className="text-xs font-medium flex items-center gap-1.5 transition-opacity opacity-75 hover:opacity-100"
            style={{ color: 'var(--text-muted)' }}
          >
            <ShieldCheck size={14} className="text-amber-500" />
            <span>Staff & Manager Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
