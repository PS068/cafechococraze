import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 ${className}`}
      style={{
        backgroundColor: 'var(--accent-light)',
        color: 'var(--accent)',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
