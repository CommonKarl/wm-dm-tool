import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'dm-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

  calendarInfo: Subscription;
  encounterInfo: Subscription;

  timePeriod: number;
  isEncounter: boolean;

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.isEncounter = false;

    this.calendarInfo = this.infoService.calendarObs.subscribe(
      x => {
        this.timePeriod = x.time_period;
      },
      err => console.error(err)
    );

    this.encounterInfo = this.infoService.encounterObs.subscribe(
      x => {
        this.isEncounter = x;
      },
      err => console.error(err)
    );
  }

}

