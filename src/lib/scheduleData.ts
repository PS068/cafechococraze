// ═══════════════════════════════════════════════════════════════
// Weekly Schedule, Live Open Status & Calendar Holiday Hours
// ═══════════════════════════════════════════════════════════════

export interface DaySchedule {
  dayName: string;
  shortName: string;
  dayIndex: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  hours: string;
  isClosed: boolean;
}

export const WEEKLY_SCHEDULE: DaySchedule[] = [
  { dayName: 'Monday', shortName: 'Mon', dayIndex: 1, hours: '12:00 PM – 9:30 PM', isClosed: false },
  { dayName: 'Tuesday', shortName: 'Tue', dayIndex: 2, hours: 'Closed', isClosed: true },
  { dayName: 'Wednesday', shortName: 'Wed', dayIndex: 3, hours: '12:00 PM – 9:30 PM', isClosed: false },
  { dayName: 'Thursday', shortName: 'Thu', dayIndex: 4, hours: '12:00 PM – 9:30 PM', isClosed: false },
  { dayName: 'Friday', shortName: 'Fri', dayIndex: 5, hours: '12:00 PM – 9:30 PM', isClosed: false },
  { dayName: 'Saturday', shortName: 'Sat', dayIndex: 6, hours: '12:00 PM – 9:30 PM', isClosed: false },
  { dayName: 'Sunday', shortName: 'Sun', dayIndex: 0, hours: '12:00 PM – 9:30 PM', isClosed: false },
];

export interface OpenStatusInfo {
  isOpen: boolean;
  statusLabel: string;
  detailLabel: string;
  color: string;
  todaySchedule: DaySchedule;
}

export function getCurrentOpenStatus(date = new Date()): OpenStatusInfo {
  const dayIndex = date.getDay();
  const minutes = date.getHours() * 60 + date.getMinutes();
  const todaySchedule = WEEKLY_SCHEDULE.find((d) => d.dayIndex === dayIndex) || WEEKLY_SCHEDULE[0];

  // Tuesday is closed
  if (dayIndex === 2) {
    return {
      isOpen: false,
      statusLabel: 'Closed today',
      detailLabel: 'Opens Wednesday at 12:00 PM',
      color: '#ef4444',
      todaySchedule,
    };
  }

  // Wed–Mon: 12:00 PM (720 min) – 9:30 PM (1290 min)
  const openMin = 12 * 60; // 720
  const closeMin = 21 * 60 + 30; // 1290

  if (minutes >= openMin && minutes < closeMin) {
    return {
      isOpen: true,
      statusLabel: 'Open now',
      detailLabel: 'Closes at 9:30 PM',
      color: '#22c55e',
      todaySchedule,
    };
  }

  if (minutes < openMin) {
    return {
      isOpen: false,
      statusLabel: 'Closed now',
      detailLabel: 'Opens today at 12:00 PM',
      color: '#f97316',
      todaySchedule,
    };
  }

  // After 9:30 PM
  const isTomorrowTuesday = dayIndex === 1; // Monday night -> Tuesday closed
  return {
    isOpen: false,
    statusLabel: 'Closed now',
    detailLabel: isTomorrowTuesday ? 'Opens Wednesday at 12:00 PM' : 'Opens tomorrow at 12:00 PM',
    color: '#ef4444',
    todaySchedule,
  };
}

// ═══════════════════════════════════════════════════════════════
// Indian Calendar Functions & Festivals Directory
// Format: YYYY-MM-DD for dynamic festivals, MM-DD for fixed dates
// ═══════════════════════════════════════════════════════════════
interface HolidayRecord {
  name: string;
  dateKey: string;
}

const KNOWN_HOLIDAYS: HolidayRecord[] = [
  // Major National & Public Holidays (Fixed annual dates)
  { dateKey: '01-01', name: "New Year's Day" },
  { dateKey: '01-26', name: 'Republic Day' },
  { dateKey: '04-14', name: 'Dr. Ambedkar Jayanti' },
  { dateKey: '05-01', name: 'Maharashtra Day' },
  { dateKey: '08-15', name: 'Independence Day' },
  { dateKey: '10-02', name: 'Mahatma Gandhi Jayanti' },
  { dateKey: '12-25', name: 'Christmas Day' },

  // Major Annual Festivals
  { dateKey: '2026-03-03', name: 'Holi' },
  { dateKey: '2026-03-19', name: 'Gudi Padwa' },
  { dateKey: '2026-09-14', name: 'Ganesh Chaturthi' },
  { dateKey: '2026-10-20', name: 'Dussehra (Vijayadashami)' },
  { dateKey: '2026-11-08', name: 'Diwali (Lakshmi Puja)' },
];

export interface CalendarHolidayNotice {
  hasNotice: boolean;
  holidayName?: string;
  isToday?: boolean;
  noticeText?: string;
}

export function getCalendarHolidayNotice(date = new Date()): CalendarHolidayNotice {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const todayFull = `${yyyy}-${mm}-${dd}`;
  const todayMonthDay = `${mm}-${dd}`;

  // Check ONLY if the present day contains a special / big holiday event
  const todayHoliday = KNOWN_HOLIDAYS.find(
    (h) => h.dateKey === todayFull || h.dateKey === todayMonthDay
  );

  if (todayHoliday) {
    return {
      hasNotice: true,
      holidayName: todayHoliday.name,
      isToday: true,
      noticeText: `${todayHoliday.name} · Hours might differ`,
    };
  }

  // Present day has no holiday/event — do not show "hours might differ"
  return { hasNotice: false };
}
