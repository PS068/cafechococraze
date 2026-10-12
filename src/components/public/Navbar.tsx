import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useData } from '../../context/DataContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { restaurant } = useData();
  const location = useLocation();

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    if (location.pathname !== '/' && location.pathname !== `/menu/${restaurant.slug}`) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {restaurant.logo_url ? (
              <img src={restaurant.logo_url} alt={restaurant.name} className="h-9 w-9 rounded-lg object-cover" />
            ) : (
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
              >
                <UtensilsCrossed size={18} />
              </div>
            )}
            <span
              className="text-lg font-semibold tracking-tight group-hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              {restaurant.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {link.label}
              </button>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
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
