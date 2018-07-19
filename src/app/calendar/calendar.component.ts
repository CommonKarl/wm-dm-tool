import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'dm-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarInfo: Subscription;
  year: number;
  day: number;
  dayS: string;
  month: string;

  constructor(private infoservice: InfoService) { }

  ngOnInit() {
    this.calendarInfo = this.infoservice.calendarObs.subscribe(
      x => {
        this.year = x.year;
        this.day = x.day;
        this.dayS = this.infoservice.days[x.day % 6];
        this.month = this.infoservice.months[x.month];
      },
      err => console.error(err)
    );
  }

}
