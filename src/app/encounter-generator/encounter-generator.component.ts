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
    console.log(this.infoService.locationCR);
  }
}