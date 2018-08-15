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
  individualOrHoard = false;
  encounterLevel = 1;
  treasureUnitValue = 100;
  hoardSelect: any;
  chosenDay = 1;
  chosenMonth = 0;
  chosenYear = 1;
  months: SelectItem[];
  hoards: SelectItem[];
  dateSet = false;
  treasureHoardValue: any;
  randomizeTV = false;

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

    this.hoards = [
      { label: 'Random', value: 0 },
      { label: 'Individual Treasure', value: 1 },
      { label: 'Small (ungaurded) Hoard', value: 2 },
      { label: 'Small Hoard', value: 3 },
      { label: 'Medium Hoard', value: 4 },
      { label: 'Large Hoard', value: 5 },
      { label: 'Huge Hoard', value: 6 },
      { label: 'Massive Hoard', value: 7 },
      { label: 'Gargantuan Hoard', value: 8 }
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
    this.individualOrHoard = false;
    this.encounterLevel = this.infoService.locationCR;
    this.hoardSelect = undefined;
    this.treasureUnitValue = 100;
  }

  generateTreasure() {
    // generate treasure!
    if (!this.individualOrHoard) {
      const d100 = this.roll(100);
      if (this.encounterLevel > 0 && this.encounterLevel <= 4) {
        // CR 0-4
        if (d100 > 0 && d100 <= 30) {
          this.treasureHoardValue = (this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) + 'cp'; // 5d6 cp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHoardValue = (this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) + 'sp'; // 4d6 sp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHoardValue = (this.roll(6) + this.roll(6) + this.roll(6)) + 'gp'; // 3d6 gp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHoardValue = this.roll(6) + 'pp'; // 1d6 pp
        } else {
          console.log('uh...error!');
        }
      } else if (this.encounterLevel > 4 && this.encounterLevel <= 10) {
        // CR 5-10
        if (d100 > 0 && d100 <= 30) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'cp; '
            + (this.roll(3) * 10) + 'gp'; // 4d6x100 cp and 1d3x10 gp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10) + 'sp; '
            + ((this.roll(6) + this.roll(6)) * 10) + 'gp'; // 6d6x10 sp and 2d6x10 gp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10) + 'gp'; // 4d6x10 gp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 10) + 'gp; ' + (this.roll(6) + this.roll(6) + this.roll(6)) + 'pp'; // 2d6x10 gp and 3d6 pp
        } else {
          console.log('uh...error!');
        }
      } else {
        // CR 11+
        if (d100 > 0 && d100 <= 30) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'sp; '
            + (this.roll(6) * 100) + 'gp'; // 4d6x100 sp and 1d6x100 gp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 100) + 'gp'; // 2d6x100 gp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + (this.roll(6) * 10) + 'pp'; // 2d6x100 gp and 1d6x10 pp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + ((this.roll(6) + this.roll(6)) * 10) + 'pp'; // 2d6x100 gp and 2d6x10 pp
        } else {
          console.log('uh...error!');
        }
      }
    } else {
      // treasure hoard
      let hoardSize;
      if (!this.hoardSelect) {
        // randomize hoard size
        const d20 = this.roll(20);
        if (d20 === 1) {
          hoardSize = 1;
        } else if (d20 > 1 && d20 <= 3) {
          hoardSize = 2;
        } else if (d20 > 3 && d20 <= 7) {
          hoardSize = 3;
        } else if (d20 > 7 && d20 <= 13) {
          hoardSize = 4;
        } else if (d20 > 13 && d20 <= 16) {
          hoardSize = 5;
        } else if (d20 > 16 && d20 <= 18) {
          hoardSize = 6;
        } else if (d20 === 19) {
          hoardSize = 7;
        } else if (d20 === 20) {
          hoardSize = 8;
        } else {
          console.log('d20 roll error');
        }
      } else {
        hoardSize = this.hoardSelect;
      }

      // roll # treasure unit based on hoard size
      let numTreasureUnits;
      switch (hoardSize) {
        case 1: numTreasureUnits = 1;
          break;
        case 2: numTreasureUnits = this.roll(3);
          break;
        case 3: numTreasureUnits = this.roll(6) + 1;
          break;
        case 4: numTreasureUnits = this.roll(4) + 3;
          break;
        case 5: numTreasureUnits = this.roll(4) + 6;
          break;
        case 6: numTreasureUnits = this.roll(4) + this.roll(4) + 6;
          break;
        case 7: numTreasureUnits = this.roll(4) + this.roll(4) + this.roll(4) + 6;
          break;
        case 8: numTreasureUnits = (this.roll(4) + 2) * 4;
          break;
        default: console.log('hoard size is unrecognizable!');
          break;
      }

      let hoardBV = 1;
      if (this.randomizeTV) {
        // calculate base value of the hoard
        const d100 = this.roll(100);
        if (d100 === 1) {
          hoardBV = .01;
        } else if (d100 > 1 && d100 <= 3) {
          hoardBV = .1;
        } else if (d100 > 3 && d100 <= 8) {
          hoardBV = .25;
        } else if (d100 > 8 && d100 <= 14) {
          hoardBV = .5;
        } else if (d100 > 14 && d100 <= 24) {
          hoardBV = .75;
        } else if (d100 > 24 && d100 <= 76) {
          hoardBV = 1;
        } else if (d100 > 76 && d100 <= 86) {
          hoardBV = 1.5;
        } else if (d100 > 86 && d100 <= 92) {
          hoardBV = 2;
        } else if (d100 > 92 && d100 <= 97) {
          hoardBV = 3;
        } else if (d100 > 97 && d100 <= 99) {
          hoardBV = 5;
        } else if (d100 === 100) {
          hoardBV = 10;
        } else {
          console.log('hoard base value error');
        }

      }

      const finalTreasureValue = this.treasureUnitValue * hoardBV;
      for (let i = 0; i < numTreasureUnits; i++) {
        this.generateIndividualTreasure(finalTreasureValue);
      }


    }
  }

  generateIndividualTreasure(treasureValue) {
    // determine type of treasure
    const typed20 = this.roll(20);
    switch (true) {
      case (typed20 < 2): console.log('art');
        break;
      case (typed20 < 4): console.log('jewel');
        break;
      case (typed20 < 8): console.log('goods');
        break;
      case (typed20 < 14): console.log('coin');
        break;
      case (typed20 < 18): console.log('furnish cloth');
        break;
      case (typed20 < 20): console.log('gem');
        break;
      case (typed20 < 21): console.log('speshul');
        break;
      default:
        console.log('type of treasure failed');
        break;
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
      this.infoService.rollForEncounter();
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
