import { useEffect } from 'react';
import { Clock, X, AlertTriangle, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  WEEKLY_SCHEDULE,
  getCurrentOpenStatus,
  getCalendarHolidayNotice,
} from '../../lib/scheduleData';

interface WeeklyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone?: string;
}

export default function WeeklyScheduleModal({
  isOpen,
  onClose,
  phone = '9850568355',
}: WeeklyScheduleModalProps) {
  const { restaurant } = useData();
  const isStoreOpen = (restaurant.theme_preferences as any)?.isOpen !== false;
  const pauseNotice = (restaurant.theme_preferences as any)?.pauseNotice as string | undefined;
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const status = getCurrentOpenStatus();
  const holiday = getCalendarHolidayNotice();
  const currentDayIndex = new Date().getDay();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div
        className="w-full max-w-md rounded-3xl border p-5 sm:p-7 shadow-2xl animate-scale-up relative"
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
          aria-label="Close hours schedule"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5 pr-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
          >
            <Clock size={24} />
          </div>
          <div>
            <h2
              id="schedule-modal-title"
              className="text-xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Hours &amp; Schedule
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {!isStoreOpen ? (
                <>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Temporarily Closed
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    · Kitchen paused
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: status.isOpen ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: status.color,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    {status.statusLabel}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    · {status.detailLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Temporary Closure Alert in Modal */}
        {!isStoreOpen && (
          <div
            className="mb-5 p-3 sm:p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs sm:text-sm bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
          >
            <AlertTriangle size={18} className="shrink-0 text-red-500 mt-0.5" />
            <div>
              <div className="font-bold">
                Store Temporarily Closed / Orders Paused
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                {pauseNotice || 'We are currently not accepting new orders. Please check back shortly or call cafe for updates.'}
              </p>
            </div>
          </div>
        )}

        {/* Google-style Holiday / Function Warning Notice */}
        {isStoreOpen && holiday.hasNotice && (
          <div
            className="mb-5 p-3 sm:p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs sm:text-sm"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              borderColor: 'rgba(245, 158, 11, 0.35)',
              color: 'var(--text-primary)',
            }}
          >
            <AlertTriangle size={18} className="shrink-0 text-amber-500 mt-0.5" />
            <div>
              <div className="font-bold text-amber-600 dark:text-amber-400">
                {holiday.noticeText}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Special holiday schedule may apply on this festival day.
              </p>
            </div>
          </div>
        )}

        {/* Weekly Day-by-Day Schedule List (Google Style) */}
        <div
          className="rounded-2xl border divide-y overflow-hidden mb-5 text-sm"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          {WEEKLY_SCHEDULE.map((item) => {
            const isToday = item.dayIndex === currentDayIndex;

            return (
              <div
                key={item.dayName}
                className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                  isToday ? 'font-bold' : 'font-normal'
                }`}
                style={{
                  backgroundColor: isToday ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    {item.dayName}
                  </span>
                  {isToday && (
                    <span
                      className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'var(--text-inverse)',
                      }}
                    >
                      Today
                    </span>
                  )}
                </div>

                <div>
                  {item.isClosed ? (
                    <span className="font-semibold text-rose-500 text-xs px-2 py-0.5 rounded-md bg-rose-500/10">
                      Closed
                    </span>
                  ) : (
                    <span
                      style={{
                        color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {item.hours}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Call / Contact Bar */}
        <div className="pt-2 flex flex-col gap-2.5">
          <a
            href={`tel:${phone}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.99] cursor-pointer"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text-inverse)',
            }}
          >
            <Phone size={15} />
            <span>Call Cafe: {phone}</span>
          </a>

          <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
            * Hours might differ during public holidays &amp; festival functions (Google Business Hours).
          </p>
        </div>
      </div>
    </div>
  );
}
