import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherGeneratorComponent } from './weather-generator.component';

describe('WeatherGeneratorComponent', () => {
  let component: WeatherGeneratorComponent;
  let fixture: ComponentFixture<WeatherGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
