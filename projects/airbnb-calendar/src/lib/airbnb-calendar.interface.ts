import { Locale, getYear } from 'date-fns';
import { he } from 'date-fns/locale';

export interface Day {
  date: Date;
  day: { dayNumber: number; freeSpace: number };
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

export interface FreeSpace {
  date: Date;
  freeSpace: string[][];
}

export interface CalendarOptions {
  freeSpacesArray: FreeSpace[];
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
  format?: string;
  formatTitle?: string;
  formatDays?: string;
  firstCalendarDay?: number;
  locale?: Locale;
  closeOnSelected?: boolean;
}

function freeSpacesArrayGenarator(start: Date, end: Date) {
  const i = 0;
  let freeSpacesArray = [];
  while (start < end) {
    start = new Date(start.setDate(start.getDate() + 1));
    freeSpacesArray.push({
      date: start,
      freeSpace: [
        ['cabin', Math.floor(Math.random() * 8).toString()],
        ['tents', Math.floor(Math.random() * 8).toString()],
        ['campgrounds', Math.floor(Math.random() * 8).toString()]
      ]
      // {
      //         cabins: Math.floor(Math.random() * 8),
      //         tents: Math.floor(Math.random() * 8),
      //         campgrounds: Math.floor(Math.random() * 8)
      //     }
    });
  }
  return freeSpacesArray;
}

export function mergeCalendarOptions(opts?: CalendarOptions): CalendarOptions {
  return { ...defaultOptions, ...opts };
}

const defaultOptions: CalendarOptions = {
  freeSpacesArray: freeSpacesArrayGenarator(new Date(), new Date(2022, 11, 17)),
  minYear: getYear(new Date()) - 30,
  maxYear: getYear(new Date()) + 30,
  format: 'yyyy/LL/dd',
  formatTitle: 'MMMM uuuu',
  formatDays: 'eeeeee',
  firstCalendarDay: 0,
  locale: he,
  closeOnSelected: false
};
