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

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.currWeather = new Weather;
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

  }

  generateWeather() {
    // tslint:disable-next-line
    let currWeather = new Weather;
    let d10 = this.infoService.roll(10) - 1;
    // determine temperature
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

    // celestial events 3 out of 20 chance
    let eventsd20 = this.infoService.roll(20);
    if (eventsd20 <= 3) {
      currWeather.celestialEvents = this.celestialEvent();
    }
    // magical weather 1 in 20 chance
    eventsd20 = this.infoService.roll(20);
    if (eventsd20 === 1) {
      currWeather.magicalWeather = this.magicalWeather();
    }
    return currWeather;
  }

  celestialEvent() {
    return CelestiallEvents[Math.floor(Math.random() * CelestiallEvents.length)];
  }

  magicalWeather() {
    return MagicalWeather[Math.floor(Math.random() * MagicalWeather.length)];
  }

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
  NorthMountains: -2,
  Caves: 0
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
  NorthMountains: 10,
  Caves: -40
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
  'Transit (small object passes in front of larger)',
  'Wanderers Gather (cluster of planets)'
];

const MagicalWeather = [
  `Skyquake - Violent shockwaves tear throught the sky, rending it and causing clouds to tear apart & scatter. Roll d100 for severity: 1-20 weak, 21-70 medium,
  71-90 strong, 91-100 massive; Con save 8/10/15/18 or be deafened for 1/2/3/4 time periods.`,
  'Dragon\'s Breath - Gusts of hot air that are accompanied by wisps of flame.',
  'Arcane Tempest - Thunderstorm with powerful magical aura. All spells and spell-like abilities are empowered (reroll # of damage dice up to your spellcasting ability mod)',
  'Luminous Clouds - These clouds cast a light that allows all creatures to see normally during the night.',
  'Clockwork Clouds - Clouds shaped like gears spin overhead slowly, sometimes interlocking with other clouds to form complex clockworks.',
  'Empyrean Sky - Golden and rose colored skies. Good aligned characters gain a +1 morale bonus to ability checks.',
  'Celestial Clarity - Perfect azure blue sky, colors appear to be more vibrant and detail appear sharper. Creatures receive +2 bonus to investigate and perception checks while outside and are immune to any fear effects',
  'Expeditious Tailwind - Fey zephyrs follow creatures, pushing them along more swiftly. These tailwinds grant a creature a 30ft. enhancement to walking speed.',
  'Aberrant Sky - Twisting and wrong, the sky is filled with an unearthly shade of clouds in impossible and monstrous shapes. Evil beings gain +1 hitpoint/HD'
];

