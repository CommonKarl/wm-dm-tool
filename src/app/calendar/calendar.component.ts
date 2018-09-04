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

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.calendarInfo = this.infoService.calendarObs.subscribe(
      x => {
        this.year = x.year;
        this.day = x.day;
        this.dayS = this.infoService.days[x.day % 6];
        this.month = this.infoService.months[x.month];
      },
      err => console.error(err)
    );
  }

}
