import { Locale, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';

export interface Day {
  date: Date;
  day: number;
  month: number;
  year: number;
  isSameMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isSelectable: boolean;
  isVisible: boolean;
  isIncluded: boolean;
  isActive: boolean;
}

export interface Calendar {
  month: number;
  year: number;
  title: string;
  dayNames: string[];
  days: Day[];
}

export interface CalendarOptions {
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  format?: string;
  formatTitle?: string;
  formatDays?: string;
  firstCalendarDay?: number;
  locale?: Locale;
  showPreviousDays?: boolean;
}

export function mergeCalendarOptions(opts?: CalendarOptions): CalendarOptions {
  return { ...defaultOptions, ...opts };
}

const defaultOptions: CalendarOptions = {
  minYear: getYear(new Date()) - 30,
  maxYear: getYear(new Date()) + 30,
  placeholder: '',
  format: 'yyyy/LL/dd',
  formatDays: 'eeeeee',
  firstCalendarDay: 0,
  locale: enUS,
  showPreviousDays: false
};
