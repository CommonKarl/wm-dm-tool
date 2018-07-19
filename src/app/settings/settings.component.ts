import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';

import { SelectItem } from 'primeng/api';

@Component({
  selector: 'dm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  showCalendarTool = false;
  chosenDay: number;
  chosenMonth: number;
  chosenYear = 1;
  months: SelectItem[];

  constructor(private infoservice: InfoService) {
    this.months = [
      { label: infoservice.months[0], value: 0 },
      { label: infoservice.months[1], value: 1 },
      { label: infoservice.months[2], value: 2 },
      { label: infoservice.months[3], value: 3 },
      { label: infoservice.months[4], value: 4 },
      { label: infoservice.months[5], value: 5 },
      { label: infoservice.months[6], value: 6 },
      { label: infoservice.months[7], value: 7 }
    ];
  }

  ngOnInit() {
  }

  openCalendarTool() {
    this.showCalendarTool = true;
  }

  setCalendar() {
    if (this.chosenDay < 1 || this.chosenDay > 30) {
      console.log("Day needs to be legit, yo.");
    } else {
      // console.log("submitting...");
      this.showCalendarTool = false;
      this.infoservice.calendar.day = this.chosenDay;
      this.infoservice.calendar.month = this.chosenMonth;
      this.infoservice.calendar.year = this.chosenYear;
      this.infoservice.updateMoonPhase();
      // console.log(this.infoservice);
    }
  }

}
