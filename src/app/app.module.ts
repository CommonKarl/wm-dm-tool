import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';

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
import { InputSwitchModule } from 'primeng/inputswitch';
import { SpinnerModule } from 'primeng/spinner';
import { CheckboxModule } from 'primeng/checkbox';
import { TreasureComponent } from './treasure/treasure.component';
import { HomeComponent } from './home/home.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import { MapImageComponent } from './map-image/map-image.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'treasure', component: TreasureComponent },
  { path: 'map', component: MapImageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WeatherGeneratorComponent,
    EncounterGeneratorComponent,
    CalendarComponent,
    SettingsComponent,
    MapComponent,
    TimeComponent,
    LunarCycleComponent,
    TreasureComponent,
    HomeComponent,
    MapImageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    InputSwitchModule,
    SpinnerModule,
    CheckboxModule,
    SelectButtonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
