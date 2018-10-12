import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'dm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  DZ: number;
  exploring: boolean;
  dzOptions: SelectItem[];

  constructor(private infoService: InfoService) {
    this.DZ = 0;
    this.dzOptions = [
      {label: 'None', value: 0},
      {label: 'Danger Zone', value: 1},
      {label: 'Easy to Find', value: 2},
    ];
  }

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
