import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InfoService } from '../info.service';
import { CalendarData } from '../data/calendar';

import * as _ from 'lodash';

@Component({
  selector: 'dm-weather-generator',
  templateUrl: './weather-generator.component.html',
  styleUrls: ['./weather-generator.component.css']
})
export class WeatherGeneratorComponent implements OnInit {

  calendarInfo: Subscription;
  currMonth: string;
  currMonthNum: number;
  currDay: number;

  currWeather: Weather;
  comingForecast: Weather[];

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.currWeather = new Weather;
    this.comingForecast = [];
    this.calendarInfo = this.infoService.calendarObs.subscribe(
      x => {
        if (this.currDay !== x.day || this.currMonth !== CalendarData.months[x.month]) {
          this.currDay = x.day;
          this.currMonthNum = x.month;
          this.currMonth = CalendarData.months[x.month];
          this.newDay();
        }
      },
      err => console.error(err)
    );
  }

  newDay() {
    this.currWeather = this.generateWeather();
    this.comingForecast = [];
    // determine temperature

  }

  generateWeather() {
    // tslint:disable-next-line
    let currWeather = new Weather;
    let d10 = this.infoService.roll(10) - 1;
    let tempTemp = eval(this.currMonth)[d10] + locationTempMod[this.infoService.location];
    tempTemp = (tempTemp < 0 ? 0 : tempTemp);
    tempTemp = (tempTemp > 6 ? 6 : tempTemp);
    currWeather.temp = temperature[tempTemp];
    // determine if it percipitates
    const d100 = this.infoService.roll(100);
    currWeather.percipitation = (d100 <= (wetness[this.currMonthNum] + locationPercipitationMod[this.infoService.location]) ? true : false);
    if (currWeather.percipitation) {
      // determine weather severity
      d10 = this.infoService.roll(10);
      let severity;
      if (d10 < 4) {
        severity = 0;
      } else if (d10 < 7) {
        severity = 1;
      } else if (d10 < 10) {
        severity = 2;
      } else {
        severity = 3;
      }
      // determine percipitate based on temperature
      let tempPercip;
      let d6;
      switch (tempTemp) {
        case 0: tempPercip = snow[severity];
          break;
        case 1:
          d6 = this.infoService.roll(6);
          tempPercip = (d6 > 5 ? rain[severity] : snow[severity]);
          break;
        case 2:
          d6 = this.infoService.roll(6);
          tempPercip = (d6 > 5 ? snow[severity] : rain[severity]);
          break;
        case 3:
        case 4:
        case 5:
        case 6: tempPercip = rain[severity];
          break;
        default: console.log('temp temp error: ' + tempTemp);
      }
      currWeather.tags.push(tempPercip);

      const sund4 = this.infoService.roll(4);
      currWeather.tags.push((severity === 3 ? sunPercipitation[3] : sunPercipitation[sund4 - 1]));
    } else {
      // 25% to be hazy, 50% wind, 25% no haze/wind
      const windd4 = this.infoService.roll(4);
      const sund4 = this.infoService.roll(4);
      if (windd4 < 3) {
        currWeather.tags.push(wind[this.infoService.roll(3) - 1]);
        currWeather.tags.push(sun[sund4 - 1]);
      } else if (windd4 === 3) {
        currWeather.tags.push('Hazy (dust, smoke, fog, humidity)');
        currWeather.tags.push(sunPercipitation[sund4 - 1]);
      } else {
        currWeather.tags.push(sun[sund4 - 1]);
      }
    }
    return currWeather;
  }

  // include next day's forecast as a small tidbit of the next week for any PC's with the Explorer background

}

export class Weather {
  temp: string;
  percipitation: boolean;
  tags: string[];
  magicalWeather: string;
  celestialEvents: string;

  constructor() {
    this.tags = [];
    this.temp = null;
    this.percipitation = false;
    this.magicalWeather = null;
    this.celestialEvents = null;
  }
}

// weather: Breezy, Clear, Cloudy, Downpour, Drizzle, Foggy, Hail, Hazy, Humid, Overcast, Showers, Snowflakes, Snowy, Stormy, Sunny, Thunderheads, Windy
//                      0         1       2         3       4      5         6
const temperature = ['Frigid (Extreme Cold! DMG 110)', 'Cold', 'Chilly', 'Mild', 'Warm', 'Hot', 'Sweltering (Extreme Heat! DMG 110)'];

// 0 - 100 = % to rain per day
const wetness = [50, 60, 50, 35, 20, 10, 20, 35];

const locationTempMod = {
  SouthJungle: 1,
  Hills: 0,
  WestJungle: 1,
  UpperWestJungle: 0,
  EastJungle: 1,
  Swamp: 0,
  NorthHills: 0,
  SouthPlains: 0,
  Highlands: 0,
  Desert: 0,
  NorthPlains: 0,
  Mountains: -2,
  NorthMountains: -2
};

const locationPercipitationMod = {
  SouthJungle: 10,
  Hills: 0,
  WestJungle: 10,
  UpperWestJungle: 20,
  // UpperWestJungle: 0    -when the Waterdrop is removed from the Sunken Forest
  EastJungle: 10,
  Swamp: 0,
  NorthHills: 0,
  SouthPlains: 0,
  Highlands: 0,
  Desert: -40,
  NorthPlains: 0,
  Mountains: 10,
  NorthMountains: 10
};

const rain = ['Drizzle', 'Showers', 'Downpour (Heavy Percipitation! DMG 110)', 'Thunder Storm (Heavy Percipitation! DMG 110)'];
const snow = ['Snowflakes', 'Snowy', 'Snowy (Heavy Percipitation! DMG 110)', 'Hail Storm (Heavy Percipitation! DMG 110)'];
const sun = ['Clear', 'Overcast', 'Sunny', 'Clear'];
const sunPercipitation = ['Cloudy', 'Overcast', 'Overcast', 'Thunderheads'];
const wind = ['Breezy', 'Windy', 'Windy (Strong Wind! DMG 110)'];

const Firstflow = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3];
const Tears = [2, 2, 3, 3, 3, 3, 3, 4, 4, 5];
const Steamfall = [3, 3, 3, 4, 4, 4, 4, 5, 5, 6];
const Firelight = [3, 4, 4, 4, 5, 5, 5, 5, 6, 6];
const Redleaf = [2, 3, 3, 3, 3, 4, 4, 4, 4, 5];
const Lowsun = [0, 1, 1, 1, 2, 2, 2, 3, 3, 3];
const Frostwind = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2];
const Felnight = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2];

const CelestiallEvents = [
  'Aurora',
  'Solar Eclipse',
  'Shooting Star',
  'Morning Star',
  'Meteor Shower',
  'Evening Star',
  'Fireball',
  'Comet Appears',
  'Celestial Conjunction',
  'Solar Flare',
  'Transit (small object passes in front of larger)'
];
