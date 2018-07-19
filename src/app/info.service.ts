import { Injectable } from '@angular/core';
import { CalendarData } from './data/calendar';

import * as _ from 'lodash';
import { Subject, from } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

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
