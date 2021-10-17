import { Component, OnInit } from '@angular/core';
import { CalendarOptions, FreeSpace } from 'airbnb-calendar';
import { subDays, addDays } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  
 ngOnInit(){
  // setTimeout(()=>{
  //   alert('asd')
  //   const freeSpacesArray = this.freeSpacesArrayGenarator1(
  //     new Date(),
  //     new Date(2022, 11, 17)
  //   );
  //   this.options = {
  //     firstCalendarDay: 0,
  //     format: 'dd/LL/yyyy',
  //     closeOnSelected: true,
  //     fromToDate: { from: new Date(2021, 9, 17), to: new Date(2021, 9, 22) },

  //     // add fromto,
  //     // minDate: addDays(new Date(), 5),
  //     // maxDate: addDays(new Date(), 10),
      
  //     freeSpacesArray: this.freeSpacesArrayGenarator1(new Date(), new Date(2022, 11, 17)),
  //   };
  // },3000)
 }
  freeSpacesArrayGenarator(start: Date, end: Date) {
    const i = 0;
    let freeSpacesArray = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArray.push({
        date: start,
        freeSpace: [
          {
            accomodationName: 'cabin',
            availableBeds: +Math.floor(Math.random() * 8).toString()
          },
          {
            accomodationName: 'tent',
            availableBeds: +Math.floor(Math.random() * 8).toString()
          },
          {
            accomodationName: 'room',
            availableBeds: +Math.floor(Math.random() * 8).toString()
          }
        ]
        //  {'cabin', Math.floor(Math.random() * 8).toString()},
        //   {'tents', Math.floor(Math.random() * 8).toString()},
        //   {'campgrounds', Math.floor(Math.random() * 8).toString()}
        // {
        //         cabins: Math.floor(Math.random() * 8),
        //         tents: Math.floor(Math.random() * 8),
        //         campgrounds: Math.floor(Math.random() * 8)
        //     }
      });
    }
    return freeSpacesArray;
  }

  sleepingType: string = '';
  date: string | null = null;
  options: CalendarOptions = {
    freeSpacesArray: this.freeSpacesArrayGenarator(new Date(), new Date(2022, 11, 17)),
    firstCalendarDay: 0,
    fromToDate: { from:new Date(2021, 9, 17), to:new Date(2021, 9, 22)},
    format: 'dd/LL/yyyy',
    closeOnSelected: true,
    // minDate: addDays(new Date(), 5),
    // maxDate: addDays(new Date(), 10),
    minYear: 2019,
    maxYear: 2021
  };
  closeCalendar(event: any){
    console.log('asd'); 
    
  }
  newDateRecived(i: any) {
    console.log(i);
  }
  prevDateRecived(i: any) {
    console.log('prev');
  }

  newSleepingPlaceRecived(i: any) {
    console.log(i);
  }

freeSpacesArrayGenarator1(start: Date, end: Date) {
  let i = 0;
  let freeSpacesArrayTemp: FreeSpace[] = [];
  while (start < end) {
    start = new Date(start.setDate(start.getDate() + 1));
    freeSpacesArrayTemp.push({
      date: start,
      freeSpace: [
        {
          accomodationName: 'בקתה',
          availableBeds: +Math.floor(Math.random() * 8).toString(),
        },
        {
          accomodationName: 'tent',
          availableBeds: +Math.floor(Math.random() * 8).toString(),
        },
        {
          accomodationName: 'room',
          availableBeds: +Math.floor(Math.random() * 8).toString(),
        },
      ],
    });
    i++;
  }
  return freeSpacesArrayTemp;
}
}