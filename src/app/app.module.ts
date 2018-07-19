import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WeatherGeneratorComponent } from './weather-generator/weather-generator.component';
import { EncounterGeneratorComponent } from './encounter-generator/encounter-generator.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SettingsComponent } from './settings/settings.component';
import { MapComponent } from './map/map.component';
import { TimeComponent } from './time/time.component';
import { LunarCycleComponent } from './lunar-cycle/lunar-cycle.component';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    AppComponent,
    WeatherGeneratorComponent,
    EncounterGeneratorComponent,
    CalendarComponent,
    SettingsComponent,
    MapComponent,
    TimeComponent,
    LunarCycleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
