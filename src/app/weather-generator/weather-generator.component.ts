import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dm-weather-generator',
  templateUrl: './weather-generator.component.html',
  styleUrls: ['./weather-generator.component.css']
})
export class WeatherGeneratorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // include next day's forecast as a small tidbit of the next week for any PC's with the Explorer background

}

const Firstflow = {
  1: ['chilly', 'cloudy', 'downpour', 'breezy']
};


