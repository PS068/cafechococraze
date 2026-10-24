import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', id }: { className?: string; id?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id={id}
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${className}`}
      style={{
        backgroundColor: 'var(--accent-light)',
        color: 'var(--accent)',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
