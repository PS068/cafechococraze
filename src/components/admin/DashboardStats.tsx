import { UtensilsCrossed, FolderOpen, CheckCircle, XCircle, type LucideIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function StatCard({ icon: Icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div
      className="rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: bgColor, color }}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const { menuItems, categories } = useData();

  const stats = {
    totalItems: menuItems.length,
    totalCategories: categories.length,
    availableItems: menuItems.filter((i) => i.is_available).length,
    unavailableItems: menuItems.filter((i) => !i.is_available).length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard icon={UtensilsCrossed} label="Total Items" value={stats.totalItems} color="#d4982a" bgColor="var(--accent-light)" />
      <StatCard icon={FolderOpen} label="Categories" value={stats.totalCategories} color="#8b5cf6" bgColor="rgba(139,92,246,0.12)" />
      <StatCard icon={CheckCircle} label="Available" value={stats.availableItems} color="#22c55e" bgColor="rgba(34,197,94,0.12)" />
      <StatCard icon={XCircle} label="Unavailable" value={stats.unavailableItems} color="#ef4444" bgColor="rgba(239,68,68,0.12)" />
    </div>
  );
}
