import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';

@Component({
  selector: 'dm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  location: String;

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.location = this.infoService.location;
  }

  changeLocation(location) {
    this.location = location;
    this.infoService.location = location;
  }

}
