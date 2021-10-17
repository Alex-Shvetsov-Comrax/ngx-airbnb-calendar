import {
  Directive,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  HostListener,
  HostBinding,
  ElementRef,
  ComponentRef,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { AirbnbCalendarComponent } from './airbnb-calendar.component';
import { Subscription } from 'rxjs';
import { NgModel } from '@angular/forms';
import { CalendarOptions, mergeCalendarOptions } from './airbnb-calendar.interface';

@Directive({
  selector: '[airbnb-calendar]'
})
export class AirbnbCalendarDirective implements OnChanges {
  @Input() options!: CalendarOptions;
  @Output() newDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() prevDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() sleepingPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeCalendar: EventEmitter<any> = new EventEmitter<any>();

  component: ComponentRef<AirbnbCalendarComponent>;
  componentFactory: ComponentFactory<AirbnbCalendarComponent>;
  sub: Subscription = new Subscription();
  constructor(
    private cfr: ComponentFactoryResolver,
    private vc: ViewContainerRef,
    private el: ElementRef,
    private ngModel: NgModel
  ) {
    this.componentFactory = this.cfr.resolveComponentFactory(AirbnbCalendarComponent);
    this.vc.clear();
    this.component = this.vc.createComponent(this.componentFactory);

    this.sub.add(
      this.component.instance.modelValue.subscribe((event: string) => {
        this.ngModel.control.patchValue(event);
      })
    );

    this.sub.add(
      this.component.instance.newDate.subscribe((event: string) => {
        this.newDate.emit(event);
      })
    );

    this.sub.add(
      this.component.instance.prevDate.subscribe((event: string) => {
        this.prevDate.emit(event);
      })
    );
    this.sub.add(
      this.component.instance.closeCalendar.subscribe((event: string) => {
        this.closeCalendar.emit(event);
      })
    );

    this.sub.add(
      this.component.instance.sleepingPlace.subscribe((event: string) => {
        this.sleepingPlace.emit(event);
      })
    );

    this.component.onDestroy(() => this.sub.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes');
    
    console.log(this.component.instance);
    if (this.component.instance) {
      // this.component.instance.sleepingPlaceType= this.options.freeSpacesArray[0].freeSpace[0].accomodationName
      this.component.instance.sleepingPlaceType =
        changes.options.currentValue.freeSpacesArray[0].freeSpace[0].accomodationName;
      this.component.instance.options = mergeCalendarOptions(changes.options.currentValue);
      mergeCalendarOptions(changes.options.currentValue);
      this.component.instance.initCalendarFunc();
    }
    this.component.instance.cd.detectChanges();
    this.component.instance.options = mergeCalendarOptions(this.options);
  }

  @HostListener('focus', ['$event.target']) onFocus(): void {
    this.component.instance.isOpened = true;
  }

  // @HostListener('click') onClick(): void {
  //   }

  //   @HostListener('class.chevron-right') private onClick() {
  //       this.newDate.emit('asdsssssssssssasd')
  // }

  @HostListener('document:click', ['$event']) onBlurClick(e: MouseEvent): void {
    const container = this.el.nativeElement.parentElement.querySelector('.airbnb-calendar-container');
    const controls = this.el.nativeElement.parentElement.querySelectorAll('.controls');

    if (
      this.component.instance.fromToDate.from &&
      this.component.instance.fromToDate.to &&
      container &&
      e.target &&
      (container === e.target || container.contains(e.target)) &&
      [].findIndex.call(controls, (ctrl: HTMLElement) => ctrl.contains(e.target as Node)) === -1
    ) {
      this.component.instance.fromToDate = { from: null, to: null };
      this.component.instance.value = null;
      this.component.instance.modelValue.next('');
      this.component.instance.fromValue.next('');
      this.component.instance.toValue.next('');
      this.component.instance.calendar.days = this.component.instance.calendar.days.map(d => ({
        ...d,
        ...{ isIncluded: false, isActive: false }
      }));
      this.component.instance.calendarNext.days = this.component.instance.calendarNext.days.map(d => ({
        ...d,
        ...{ isIncluded: false, isActive: false }
      }));
      this.component.instance.cd.detectChanges();
    }

    if (!this.component.instance.isOpened) {
      return;
    }

    const input = this.el.nativeElement;
    if (!input) {
      return;
    }

    if (e.target === input || input.contains(e.target)) {
      return;
    }

    if (
      container &&
      container !== e.target &&
      !(e.target as HTMLElement).classList.contains('day') &&
      !container.contains(e.target)
    ) {
      this.component.instance.isOpened = false;
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyup(ev: KeyboardEvent): void {
    if (!this.component.instance.isOpened) {
      return;
    }

    if (ev.keyCode === 27) {
      this.component.instance.isOpened = false;
      this.component.instance.cd.detectChanges();
      this.el.nativeElement.blur();
    }
  }
}
