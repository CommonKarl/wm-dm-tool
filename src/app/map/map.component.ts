import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';

@Component({
  selector: 'dm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  DZ: boolean;
  exploring: boolean;

  constructor(private infoService: InfoService) { }

  ngOnInit() {
  }

  changeLocation(location, challengeRating, dangerLevel) {
    this.infoService.location = location;
    this.infoService.locationCR = challengeRating;
    this.infoService.locationDL = dangerLevel;
  }

  dangerZone() {
    this.infoService.dangerZone = this.DZ;
  }

  explore() {
    this.infoService.exploring = this.exploring;
  }

}
