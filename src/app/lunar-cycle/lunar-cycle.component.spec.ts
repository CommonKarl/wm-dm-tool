import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunarCycleComponent } from './lunar-cycle.component';

describe('LunarCycleComponent', () => {
  let component: LunarCycleComponent;
  let fixture: ComponentFixture<LunarCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunarCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunarCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
