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

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.calendarInfo = this.infoService.calendarObs.subscribe(
      x => {
        console.log(x);
      },
      err => console.error(err)
    );
  }

}

