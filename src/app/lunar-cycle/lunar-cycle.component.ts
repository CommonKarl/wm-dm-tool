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
    _.forEach(this.moonNames, function(value, index) {
      this.moons.push(new Moon);
      this.moons[index].name = value;
      this.moons[index].cycle = this.infoservice.getCycle(value);
      this.moons[index].shift = this.infoservice.getShift(value);
      console.log(this.moons);
    }.bind(this));
  }

  ngOnInit() {
    this.calendarInfo = this.infoservice.calendarObs.subscribe(
      x => { },
      err => console.error(err)
    );
  }

}

class Moon {
  name: string;
  cycle: number;
  shift: number;
}

const enum Cycle {
  new = "New",
  waxC = "Waxing Crescent",
  fq = "First Quarter",
  waxG = "Waxing Gibbous",
  full = "Full",
  waneG = "Waning Gibbous",
  lq = "Last Quarter",
  waneC = "Waning Crescent"
}
