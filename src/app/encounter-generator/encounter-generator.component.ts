import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { Subscription } from '../../../node_modules/rxjs';
import * as ET from '../data/encounter-tables';
import * as EP from '../data/encounter-probabilities';
import { Motivations } from '../data/motivations';

@Component({
  selector: 'dm-encounter-generator',
  templateUrl: './encounter-generator.component.html',
  styleUrls: ['./encounter-generator.component.css']
})
export class EncounterGeneratorComponent implements OnInit {

  encounterInfo: Subscription;
  objectKeys = Object.keys;

  currEncounter: string;
  xpAllowance: number;
  xpAllowanceMed: number;
  xpAllowanceDeadly: number;
  numPC = 5;
  treasure: any;

  currEncounterEntities: any;
  currEncounterValue: number;
  currEncounterNumbers: any;
  currEncounterCRs: any;
  totalXP = 0;
  totalNum = 0;
  motivation = '';

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.encounterInfo = this.infoService.encounterObs.subscribe(
      x => {
        if (x === true) {
          this.clearEncounter();
          this.generateEncounter();
        } else {
          this.clearEncounter();
        }
      },
      err => console.error(err)
    );
  }

  clearEncounter() {
    this.currEncounter = null;
    this.currEncounterEntities = undefined;
    this.currEncounterNumbers = undefined;
    this.currEncounterCRs = undefined;
    this.xpAllowance = null;
    this.xpAllowanceDeadly = null;
    this.xpAllowanceMed = null;
    this.totalXP = 0;
    this.totalNum = 0;
    this.motivation = '';
  }

  generateEncounter() {
    this.currEncounterNumbers = Object.assign({}, EmptyEncounter);
    this.currEncounterCRs = Object.assign({}, EmptyEncounter);
    // roll 2d6 + 1d10 for encounter
    const encounterRoll = this.roll(6) + this.roll(6) + this.roll(10);
    // set encounter tables
    const tempET = ET[this.infoService.location];
    const tempEP = EP[this.infoService.location];
    // get name of encounter
    this.currEncounter = tempEP[encounterRoll];

    this.xpAllowance = xpThresholds[this.infoService.locationCR] * this.numPC;
    this.xpAllowanceMed = xpThresholdsMed[this.infoService.locationCR] * this.numPC;
    this.xpAllowanceDeadly = xpThresholdsDeadly[this.infoService.locationCR] * this.numPC;
    this.currEncounterEntities = tempET[this.currEncounter];

    this.generateTreasure(this.infoService.locationCR);

    this.generateMotivation();

    const el = this;
    setTimeout(function () {
      el.currEncounterXP();
    }, 1, this);
  }

  adjustEncounter() {
    this.xpAllowance = xpThresholds[this.infoService.locationCR] * this.numPC;
    this.xpAllowanceMed = xpThresholdsMed[this.infoService.locationCR] * this.numPC;
    this.xpAllowanceDeadly = xpThresholdsDeadly[this.infoService.locationCR] * this.numPC;
  }

  generateMotivation() {
    this.motivation = '';
    const d100 = this.roll(100);
    this.motivation = Motivations[Math.floor(Math.random() * Motivations.length)];
  }

  currEncounterXP() {
    this.totalXP = 0;
    this.totalNum = 0;
    for (let i = 0; i < 10; i++) {
      // totalXP  = monsterXP[this.currEncounterCRs[i]];
      // need to populate currEncounterCRs!!!!
      const elCR: any = document.querySelector('#monsterCR' + i);
      if (elCR) {
        this.currEncounterCRs[i] = elCR.value;
        this.totalXP += monsterXP[this.currEncounterCRs[i]] * this.currEncounterNumbers[i];
        this.totalNum += this.currEncounterNumbers[i];
      }

    }
    this.totalNum = (this.totalNum > 15) ? 15 : this.totalNum;
    console.log(encounterMult[this.totalNum]);
    this.totalXP = this.totalXP * encounterMult[this.totalNum];
  }

  generateTreasure(encounterLevel) {
    const d100 = this.roll(100);
    if (encounterLevel >= 0 && encounterLevel <= 4) {
      // CR 0-4
      if (d100 > 0 && d100 <= 30) {
        this.treasure = this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + 'cp'; // 5d6 cp
      } else if (d100 > 30 && d100 <= 60) {
        this.treasure = this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + 'sp'; // 4d6 sp
      } else if (d100 > 60 && d100 <= 95) {
        this.treasure = this.roll(6) + this.roll(6) + this.roll(6) + 'gp'; // 3d6 gp
      } else if (d100 > 95 && d100 <= 100) {
        this.treasure = this.roll(6) + 'pp'; // 1d6 pp
      } else {
        console.log('uh...error!');
      }
    } else if (encounterLevel > 4 && encounterLevel <= 10) {
      // CR 5-10
      if (d100 > 0 && d100 <= 30) {
        this.treasure = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'cp; ' + (this.roll(3) * 10) + 'gp'; // 4d6x100 cp and 1d3x10 gp
      } else if (d100 > 30 && d100 <= 60) {
        this.treasure = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10) + 'sp; '
          + ((this.roll(6) + this.roll(6)) * 10) + 'gp'; // 6d6x10 sp and 2d6x10 gp
      } else if (d100 > 60 && d100 <= 95) {
        this.treasure = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10) + 'gp'; // 4d6x10 gp
      } else if (d100 > 95 && d100 <= 100) {
        this.treasure = ((this.roll(6) + this.roll(6)) * 10) + 'gp; ' + (this.roll(6) + this.roll(6) + this.roll(6)) + 'pp'; // 2d6x10 gp and 3d6 pp
      } else {
        console.log('uh...error!');
      }
    } else {
      // CR 11+
      if (d100 > 0 && d100 <= 30) {
        this.treasure = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'sp; '
          + (this.roll(6) * 100) + 'gp'; // 4d6x100 sp and 1d6x100 gp
      } else if (d100 > 30 && d100 <= 60) {
        this.treasure = ((this.roll(6) + this.roll(6)) * 100) + 'gp'; // 2d6x100 gp
      } else if (d100 > 60 && d100 <= 95) {
        this.treasure = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + (this.roll(6) * 10) + 'pp'; // 2d6x100 gp and 1d6x10 pp
      } else if (d100 > 95 && d100 <= 100) {
        this.treasure = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + ((this.roll(6) + this.roll(6)) * 10) + 'pp'; // 2d6x100 gp and 2d6x10 pp
      } else {
        console.log('uh...error!');
      }
    }
  }

  roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }
}

const EmptyEncounter = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0
};

const monsterXP = {
  0: 10,
  .125: 25,
  .25: 50,
  .5: 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000
};

const xpThresholdsMed = {
  1: 50,
  2: 100,
  3: 150,
  4: 250,
  5: 500,
  6: 600,
  7: 750,
  8: 900,
  9: 1100,
  10: 1200,
  11: 1600,
  12: 2000,
  13: 2200,
  14: 2500,
  15: 2800,
  16: 3200,
  17: 3900,
  18: 4200,
  19: 4900,
  20: 5700
};

const xpThresholds = {
  1: 75,
  2: 150,
  3: 225,
  4: 375,
  5: 750,
  6: 900,
  7: 1100,
  8: 1400,
  9: 1600,
  10: 1900,
  11: 2400,
  12: 3000,
  13: 3400,
  14: 3800,
  15: 4300,
  16: 4800,
  17: 5900,
  18: 6300,
  19: 7300,
  20: 8500
};

const xpThresholdsDeadly = {
  1: 100,
  2: 200,
  3: 400,
  4: 500,
  5: 1100,
  6: 1400,
  7: 1700,
  8: 2100,
  9: 2400,
  10: 2800,
  11: 3600,
  12: 4500,
  13: 5100,
  14: 5700,
  15: 6400,
  16: 7200,
  17: 8800,
  18: 9500,
  19: 10900,
  20: 12700
};

const encounterMult = {
  1: 1,
  2: 1.5,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 2.5,
  8: 2.5,
  9: 2.5,
  10: 2.5,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 4
};
