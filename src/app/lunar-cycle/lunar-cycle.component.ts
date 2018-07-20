import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { Subscription } from '../../../node_modules/rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'dm-lunar-cycle',
  templateUrl: './lunar-cycle.component.html',
  styleUrls: ['./lunar-cycle.component.css']
})
export class LunarCycleComponent implements OnInit {

  moonNames: string[];
  moons: Moon[] = [];
  calendarInfo: Subscription;

  constructor(private infoservice: InfoService) {
    this.moonNames = this.infoservice.moons;
    _.forEach(this.moonNames, function (value, index) {
      this.moons.push(new Moon);
      this.moons[index].name = value;
      this.moons[index].cycleNum = this.infoservice.getCycle(value);
      this.moons[index].shiftNum = this.infoservice.getShift(value);
    }.bind(this));
    console.log(this.moons);
  }

  ngOnInit() {
    this.calendarInfo = this.infoservice.calendarObs.subscribe(
      x => {
        this.configureMoons(x);
        console.log(x);
      },
      err => console.error(err)
    );
  }

  configureMoons(data) {
    // cycle/8 = # of days in a phase
    _.forEach(data.moon_phase, function (value, index) {
      // get moon name by index; value = current moon cycle #
      let moon = index.replace('_', ' ');
      moon = this.infoservice.toTitleCase(moon);

      const moonObj = this.moons.filter(function (obj) { return obj.name === moon; })[0];
      moonObj.cycle = Cycle[Math.floor(value / moonObj.cycleNum * 8)];
    }.bind(this));
  }
}

class Moon {
  name: string;
  cycleNum: number;
  shiftNum: number;
  cycle: Cycle;
}

enum Cycle {
  "New",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent"
}