import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ElementRef,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Calendar, CalendarOptions, mergeCalendarOptions, Day } from './airbnb-calendar.interface';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDate,
  getMonth,
  getYear,
  isToday,
  isSameMonth,
  format,
  addMonths,
  setDay,
  getDay,
  subDays,
  subMonths,
  isAfter,
  isBefore,
  setHours,
  isSameDay,
  setMinutes,
  setSeconds
} from 'date-fns';

@Component({
  selector: 'airbnb-calendar',
  templateUrl: './airbnb-calendar.component.html',
  styleUrls: ['./airbnb-calendar.component.sass'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AirbnbCalendarComponent, multi: true }]
})
export class AirbnbCalendarComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options!: CalendarOptions;
  @Output() modelValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() fromValue: EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() toValue: EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() newDate: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() prevDate: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() sleepingPlace: EventEmitter<string> = new EventEmitter<string>();
  private date: Date = new Date();
  private innerValue: string | null = null;

  isOpened: boolean = false;
  calendar!: Calendar;
  calendarNext!: Calendar;
  fromToDate: { from: Date | null; to: Date | null } = { from: null, to: null };
  sleepingPlaceType:string=''
  get value(): string | null {
    return this.innerValue;
  }

  set value(val: string | null) {
    this.innerValue = val;
  }

  get controlsStatus(): { from: boolean; to: boolean } {
    return {
      from: Boolean(this.options.minYear && this.options.minYear < this.calendar.year && this.calendar.month !== 0),
      to: Boolean(
        this.options.maxYear && this.options.maxYear > this.calendarNext.year && this.calendarNext.month !== 11
      )
    };
  }

  writeValue(val: string | null): void {
    this.innerValue = val;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  constructor(private elementRef: ElementRef, public cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sleepingPlaceType=this.options.freeSpacesArray[0].freeSpace[0][0]
    this.options = mergeCalendarOptions(this.options);
    
    this.initCalendar();
  }

  ngOnChanges(): void {
    this.options = mergeCalendarOptions(this.options);
    this.initCalendar();
  }

  sleepingPlaceHandler(sleepingPlace:string){
    this.sleepingPlaceType=sleepingPlace
    this.options = mergeCalendarOptions(this.options);
    this.initCalendar();
    this.sleepingPlace.emit(sleepingPlace)
     

  }

  selectDay(index?: number, calendar?: 'primary' | 'secondary'): void {
    if (index) {
      const cal = calendar === 'primary' ? this.calendar : this.calendarNext;
      if (!this.fromToDate.from) {
        this.fromToDate.from = cal.days[index].date;
        const from = format(this.fromToDate.from as Date, this.options.format as string);
        this.value = from;
        this.modelValue.next(from);
        this.fromValue.next(from);
      } else if (this.fromToDate.from && !this.fromToDate.to) {
        this.fromToDate.to = cal.days[index].date;
        const from = format(this.fromToDate.from as Date, this.options.format as string);
        const to = format(this.fromToDate.to as Date, this.options.format as string);
        this.value = `${from}-${to}`;
        this.modelValue.next(this.value);
        this.toValue.next(this.value);

        if (this.options.closeOnSelected) {
          this.isOpened = false;
        }
      } else if (this.fromToDate.to) {
        this.fromToDate = { from: cal.days[index].date, to: null };
        const from = format(this.fromToDate.from as Date, this.options.format as string);
        this.value = from;
        this.modelValue.next(from);
        this.fromValue.next(from);
      }
    }

    this.calendar.days = this.calendar.days.map((d: Day) => {
      return {
        ...d,
        ...{
          isIncluded:
            isAfter(d.date, this.fromToDate.from || new Date()) && isBefore(d.date, this.fromToDate.to || new Date()),
          isActive:
            isSameDay(this.fromToDate.from || new Date(), d.date) || isSameDay(this.fromToDate.to as Date, d.date)
        }
      };
    });

    this.calendarNext.days = this.calendarNext.days.map((d: Day) => {
      return {
        ...d,
        ...{
          isIncluded:
            isAfter(d.date, this.fromToDate.from || new Date()) && isBefore(d.date, this.fromToDate.to || new Date()),
          isActive:
            isSameDay(this.fromToDate.from || new Date(), d.date) || isSameDay(this.fromToDate.to as Date, d.date)
        }
      };
    });
  }

  nextMonth(): void {
    this.newDate.next(this.date)
    this.date = addMonths(this.date, 1);
    this.initCalendar();
    this.selectDay();
  }

  prevMonth(): void {
    this.date = subMonths(this.date, 1);
    this.prevDate.next(this.date)
    this.initCalendar();
    this.selectDay();
  }

  private initCalendar(): void {
    const date = new Date(this.date.getTime());
    this.calendar = this.generateCalendar(date);
    this.calendarNext = this.generateCalendar(addMonths(date, 1));
  }

  private generateCalendar(date: Date = new Date()): Calendar {
    const [start, end, now] = [
      setHours(startOfMonth(date), 0),
      setHours(endOfMonth(date), 0),
      setSeconds(setMinutes(setHours(new Date(), 0), 0), 0)
    ];
    const days: Day[] = eachDayOfInterval({ start, end })
      .map(d => {
        d = setSeconds(setMinutes(setHours(d, 0), 0), 0);
        return {
          date: d,
          day: { dayNumber: getDate(d), 
            freeSpace: this.returnFreeSpace(d) },
          month: getMonth(d),
          year: getYear(d),
          isSameMonth: isSameMonth(d, start),
          isToday: isToday(d),
          isSelectable: isBefore(now, d) || isSameDay(now, d),
          isSelected: false,
          isVisible: true,
          isIncluded: isAfter(d, this.fromToDate.from || new Date()) && isBefore(d, this.fromToDate.to || new Date()),
          isActive: false
        };
      })
      .reduce((acc: Day[], curr: Day, index: number, arr: Day[]) => {
        const first = this.options.firstCalendarDay || 0;
        const tmp = getDay(start) - first;

        if (tmp > 0 && arr.length - 1 === index) {
          acc.unshift(
            ...[...new Array(tmp)].map((_, i) => {
              const curr = setSeconds(setMinutes(setHours(subDays(start, i + 1), 0), 0), 0);
              return {
                date: curr,
                day: { dayNumber: getDate(curr), freeSpace: this.returnFreeSpace(curr) },
                month: getMonth(curr),
                year: getYear(curr),
                isSameMonth: false,
                isToday: false,
                isSelectable: false,
                isSelected: false,
                isVisible: true,
                isIncluded:
                  isAfter(curr, this.fromToDate.from || new Date()) && isBefore(curr, this.fromToDate.to || new Date()),
                isActive: false
              };
            })
          );
        }

        return acc.concat(curr);
      }, [])
      .sort((a, b) => (a.date >= b.date ? 1 : -1));

    const dayNames = [];
    const dayStart = this.options.firstCalendarDay || 0;
    for (let i = dayStart; i <= 6 + dayStart; i++) {
      const date = setDay(new Date(), i);
      dayNames.push(format(date, this.options.formatDays || 'eeeeee', { locale: this.options.locale }));
    }

    return {
      month: getMonth(date),
      year: getYear(date),
      title: format(date, this.options.formatTitle || 'MMMM uuuu', { locale: this.options.locale }),
      days,
      dayNames
    };
  }


returnFreeSpace(date:Date):number{


  return +this.options.freeSpacesArray.filter(day => {
    return getDate(day.date) === getDate(date);
})[0].freeSpace.filter(sleepingType=>sleepingType[0]===this.sleepingPlaceType)[0][1]
}

}
