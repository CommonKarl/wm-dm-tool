import { Component, OnInit } from '@angular/core';
import * as ET from '../data/encounter-tables';
import { InfoService } from '../info.service';

@Component({
  selector: 'dm-encounter-generator',
  templateUrl: './encounter-generator.component.html',
  styleUrls: ['./encounter-generator.component.css']
})
export class EncounterGeneratorComponent implements OnInit {

  currEncounter: string;
  PC: Player[] = [];
  showPCTool = false;

  chosenClass: string;
  chosenLevel: number;

  constructor(private infoService: InfoService) { }

  ngOnInit() {
  }

  generateEncounter() {
    const tempLocation = this.infoService.location;
    const tempET = ET[tempLocation];
    const keys = Object.keys(tempET);
    const rand = keys.length;
    this.currEncounter = keys[Math.floor(Math.random() * rand)];
    if (typeof (tempET[this.currEncounter]) === "number") {
      // generate normal encounter by CR
    } else {
      // monster block with multiple types/CRs
    }
  }

  openPCTool() {
    this.showPCTool = true;
  }

  addPC() {
    const tempPC = { class: this.chosenClass, level: this.chosenLevel };
    this.PC.push(tempPC);
    this.showPCTool = false;
  }

  popPC(index) {
    this.PC.splice(index, 1);
  }

}

export class Player {
  class: string;
  level: number;
}

const XP_by_level = {
  1: 75,
  2: 150,
  3: 225,
  4: 375,
  5: 750
}
