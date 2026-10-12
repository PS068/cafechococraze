import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : 'var(--accent)',
          }}
        >
          {toast.type === 'success' && <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />}
          <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-0.5 rounded-full transition-colors hover:bg-black/10"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
