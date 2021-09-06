import { Component } from '@angular/core';
import { CalendarOptions } from 'airbnb-calendar';
import { subDays, addDays } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  
 freeSpacesArrayGenarator(start: Date, end: Date) {
  const i = 0;
  let freeSpacesArray = [];
  while (start < end) {
    start = new Date(start.setDate(start.getDate() + 1));
    freeSpacesArray.push({
      date: start,
      freeSpace: 
        [
          {
            accomodationName: "cabin",
            availableBeds: +Math.floor(Math.random() * 8).toString()
          },
                      {
            accomodationName: "tent",
            availableBeds: +Math.floor(Math.random() * 8).toString()
          },
                      {
            accomodationName: "room",
            availableBeds: +Math.floor(Math.random() * 8).toString()
          },
                      
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

  sleepingType:string=''
  date: string | null = null;
  options: CalendarOptions = {
    freeSpacesArray: this.freeSpacesArrayGenarator(new Date(), new Date(2022, 11, 17)),
    firstCalendarDay: 1,
    format: 'LL/dd/yyyy',
    closeOnSelected: true,
    // minDate: addDays(new Date(), 5),
    // maxDate: addDays(new Date(), 10),
    minYear: 2019,
    maxYear: 2021
  };


  newDateRecived(i:any){
    console.log(i); 
    
  }
  prevDateRecived(i:any){
    console.log('prev'); 
    
  }
  
  newSleepingPlaceRecived(i:any){
    console.log(i); 
    
  }
}
