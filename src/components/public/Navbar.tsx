import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Coffee, Building2 } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useData } from '../../context/DataContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { restaurant } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);

    // Smoothly scroll to the very top (first view of the page)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Notify listeners (like PublicMenuPage) to reset search query and active category
    window.dispatchEvent(new CustomEvent('nav-to-first-page'));

    // Client-side navigate to root without reloading the page
    if (location.pathname !== '/' && location.pathname !== '/sangli' && location.pathname !== `/menu/${restaurant.slug}`) {
      navigate('/');
    } else if (location.hash || location.search) {
      navigate(location.pathname, { replace: true });
    }
  };

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    if (location.pathname !== '/' && location.pathname !== '/sangli' && location.pathname !== `/menu/${restaurant.slug}`) {
      navigate(`/${href}`);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 nav-glass border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-nav)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-[4.75rem]">
          {/* Logo & Brand Name - Smoothly returns to first page without refresh */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer"
            aria-label={`${restaurant.name} home - go to first page`}
          >
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl object-contain p-0.5 ring-1 ring-black/10 shadow-xs bg-white"
              />
            ) : (
              <div
                className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
              >
                <Coffee size={20} strokeWidth={1.8} className="sm:w-[22px] sm:h-[22px]" />
              </div>
            )}
            <span
              className="text-base sm:text-xl md:text-2xl font-bold tracking-tight group-hover:opacity-85 transition-opacity"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              {restaurant.name}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm sm:text-base font-medium rounded-xl transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {link.label}
              </button>
            ))}

            <ThemeToggle />
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
               aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
               aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {isOpen && (
        <div className="md:hidden border-t animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
