import { MapPin, Phone, Clock, UtensilsCrossed } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '../common/SocialIcons';
import { useData } from '../../context/DataContext';

export default function Footer() {
  const { restaurant } = useData();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t mt-16"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {restaurant.logo_url ? (
                <img src={restaurant.logo_url} alt={restaurant.name} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                >
                  <UtensilsCrossed size={20} />
                </div>
              )}
              <span
                className="text-xl font-bold"
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
          <div id="about">
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Contact Us
            </h3>
            <div className="space-y-3">
              {restaurant.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{restaurant.address}</span>
                </div>
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
              Opening Hours
            </h3>
            {restaurant.opening_hours && (
              <div className="flex items-start gap-3">
                <Clock size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{restaurant.opening_hours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-10 pt-6 text-center" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {year} {restaurant.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
