import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';

import { SelectItem } from 'primeng/api';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'dm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  calendarInfo: Subscription;
  showCalendarTool = false;
  showTreasureTool = false;
  individualOrHorde = false;
  encounterLevel = 1;
  chosenDay = 1;
  chosenMonth = 0;
  chosenYear = 1;
  months: SelectItem[];
  dateSet = false;
  treasureHorde: any;

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

    this.setCalendar();
  }

  openCalendarTool() {
    this.showCalendarTool = true;
  }

  openTreasure() {
    this.showTreasureTool = true;
    this.individualOrHorde = false;
    this.encounterLevel = this.infoService.locationCR;
  }

  generateTreasure() {
    // generate treasure!
    if (!this.individualOrHorde) {
      const d100 = this.roll(100);
      if (this.encounterLevel > 0 && this.encounterLevel <= 4) {
        // CR 0-4
        if (d100 > 0 && d100 <= 30) {
          this.treasureHorde = (this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) + 'cp'; // 5d6 cp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHorde = (this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6))  + 'sp'; // 4d6 sp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHorde = (this.roll(6) + this.roll(6) + this.roll(6)) + 'gp'; // 3d6 gp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHorde = this.roll(6) + 'pp'; // 1d6 pp
        } else {
          console.log('uh...error!');
        }
      } else if (this.encounterLevel > 4 && this.encounterLevel <= 10) {
        // CR 5-10
        if (d100 > 0 && d100 <= 30) {
          this.treasureHorde = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'cp; '
                                + (this.roll(3) * 10) + 'gp'; // 4d6x100 cp and 1d3x10 gp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHorde = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10)  + 'sp; '
                                + ((this.roll(6) + this.roll(6)) * 10) + 'gp'; // 6d6x10 sp and 2d6x10 gp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHorde = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10) + 'gp'; // 4d6x10 gp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHorde = ((this.roll(6) + this.roll(6)) * 10) + 'gp; ' + (this.roll(6) + this.roll(6) + this.roll(6)) + 'pp'; // 2d6x10 gp and 3d6 pp
        } else {
          console.log('uh...error!');
        }
      } else {
        // CR 11+
        if (d100 > 0 && d100 <= 30) {
          this.treasureHorde = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'sp; '
          + (this.roll(6) * 100) + 'gp'; // 4d6x100 sp and 1d6x100 gp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHorde = ((this.roll(6) + this.roll(6)) * 100)  + 'gp'; // 2d6x100 gp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHorde = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + (this.roll(6) * 10) + 'pp'; // 2d6x100 gp and 1d6x10 pp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHorde = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + ((this.roll(6) + this.roll(6)) * 10) + 'pp'; // 2d6x100 gp and 2d6x10 pp
        } else {
          console.log('uh...error!');
        }
      }
    } else {
      // treasure horde
    }
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
      this.infoService.calendar.day = this.chosenDay;
      this.infoService.calendar.month = this.chosenMonth;
      this.infoService.calendar.year = this.chosenYear;
      this.infoService.updateMoonPhase();
      this.dateSet = true;
      // console.log(this.infoService);
    }
  }

  advanceTimePeriod() {
    this.infoService.advanceTimePeriod();
  }

  roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

}
