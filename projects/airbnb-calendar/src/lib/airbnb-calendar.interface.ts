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
  freeSpace: {
    accomodationName: string;
    availableBeds: number;
  }[];
}

export interface CalendarOptions {
  freeSpacesArray: FreeSpace[];
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
  fromToDate?: { from: Date | null; to: Date | null };

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
        {
          accomodationName: 'cabin',
          availableBeds: +Math.floor(Math.random() * 300).toString()
        },
        {
          accomodationName: 'tent',
          availableBeds: +Math.floor(Math.random() * 300).toString()
        },
        {
          accomodationName: 'room',
          availableBeds: +Math.floor(Math.random() * 300).toString()
        }
      ]
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
