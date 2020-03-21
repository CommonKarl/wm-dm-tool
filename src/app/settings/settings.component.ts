import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';

import { SelectItem } from 'primeng/api';
import { Subscription } from '../../../node_modules/rxjs';

import * as _ from 'lodash';

@Component({
  selector: 'dm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  calendarInfo: Subscription;
  encounterInfo: Subscription;
  showCalendarTool = false;
  chosenDay = 11;
  chosenMonth = 1;
  chosenYear = 1;
  months: SelectItem[];
  dateSet = false;
  atp = true;

  constructor(private infoService: InfoService) {
    this.months = [
      { label: infoService.months[0], value: 0 },
      { label: infoService.months[1], value: 1 },
      { label: infoService.months[2], value: 2 },
      { label: infoService.months[3], value: 3 },
      { label: infoService.months[4], value: 4 },
      { label: infoService.months[5], value: 5 },
      { label: infoService.months[6], value: 6 },
      { label: infoService.months[7], value: 7 }
    ];
  }

  ngOnInit() {
    this.calendarInfo = this.infoService.calendarObs.subscribe(
      x => {
        this.chosenYear = x.year;
        this.chosenDay = x.day;
        this.chosenMonth = x.month;
      },
      err => console.error(err)
    );

    this.encounterInfo = this.infoService.encounterObs.subscribe(
      x => {
        if (x === true) {
          this.disableATP();
        } else {
          this.enableATP();
        }
      },
      err => console.error(err)
    );

    this.setCalendar();
  }
  
  disableATP(){
    this.atp = false;
  }

  enableATP(){
    this.atp = true;
  }

  openCalendarTool() {
    this.showCalendarTool = true;
  }

  addDay() {
    this.infoService.addDay();
  }

  setCalendar() {
    if (this.chosenDay < 1 || this.chosenDay > 30) {
      console.log("Day needs to be legit, yo.");
    } else {
      // console.log("submitting...");
      this.showCalendarTool = false;
      this.infoService.calendar.time_period = 1;
      this.infoService.calendar.day = this.chosenDay;
      this.infoService.calendar.month = this.chosenMonth;
      this.infoService.calendar.year = this.chosenYear;
      this.infoService.updateMoonPhase();
      this.infoService.rollForEncounter();
      this.dateSet = true;
    }
  }

  advanceTimePeriod() {
    this.infoService.advanceTimePeriod();
  }

  roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  goToMap(){
    window.open('http://localhost:4200/map', "_blank");
  }

  goToTreasure(){
    window.open('http://localhost:4200/treasure', "_blank");
  }

}
