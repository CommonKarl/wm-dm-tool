import { Injectable } from '@angular/core';
import { CalendarData } from './data/calendar';

import * as _ from 'lodash';
import { Subject, from } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  location = "SouthJungle";
  locationCR = 1;
  locationDL = 1; // Danger Level (1-6; roll 1d6 on # or lower = encounter in that time period)
  dangerZone = false; // if true then Danger Level should increase by 1
  calendarObs: Subject<Calendar>;
  calendar: Calendar = {
    day: 0,
    month: 0,
    year: 0,
    moon_phase: {
      night_sun: 0,
      blood_moon: 0
    },
    time_period: 0
  };
  months: string[];
  days: string[];
  moons: string[];

  constructor() {
    this.calendarObs = new Subject();
    this.months = CalendarData.months;
    this.days = CalendarData.weekdays;
    this.moons = CalendarData.moons;
  }

  addDay() {
    if (this.calendar.day < 30) {
      this.calendar.day += 1;
    } else {
      this.calendar.month += 1;
      this.calendar.day = 1;
    }
    /*_.forEach(this.calendar.moon_phase, function (value, index) {
      // Get moon name and cycle #
      let moon = index.replace('_', ' ');
      moon = this.toTitleCase(moon);
      const cycle = CalendarData.lunar_cyc[moon];

      if (value < cycle) {
        this.calendar.moon_phase[index] = value + 1;
      } else {
        this.calendar.moon_phase[index] = 0;
      }
    }.bind(this));*/
    this.updateMoonPhase();
  }

  updateMoonPhase() {
    const totalDays = ((this.calendar.year - 1) * 240) + (this.calendar.month * 30) + this.calendar.day;
    this.calendar.moon_phase.night_sun = (totalDays - 1 + CalendarData.lunar_shf["Night Sun"]) % CalendarData.lunar_cyc["Night Sun"];
    this.calendar.moon_phase.blood_moon = (totalDays - 1 + CalendarData.lunar_shf["Blood Moon"]) % CalendarData.lunar_cyc["Blood Moon"];
    this.updateInfo();
  }

  updateInfo() {
    this.calendarObs.next(this.calendar);
  }

  getCycle(moon) {
    return CalendarData.lunar_cyc[moon];
  }

  getShift(moon) {
    return CalendarData.lunar_shf[moon];
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

interface Calendar {
  day: number;
  month: number;
  year: number;
  moon_phase: {
    night_sun: number,
    blood_moon: number,
  };
  time_period: number;
}
