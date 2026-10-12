import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl animate-fade-in-up"
        style={{ backgroundColor: 'var(--bg-card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {title}
          </h3>
          <button onClick={onCancel} className="p-1 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{message}</p>

        {children}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-xl transition-colors border"
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-default)',
              backgroundColor: 'transparent',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
            style={{
              backgroundColor: variant === 'danger' ? '#ef4444' : 'var(--accent)',
              color: variant === 'danger' ? '#fff' : 'var(--text-inverse)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
