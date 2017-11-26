import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveGameMonitorComponent } from './live-game-monitor.component';

describe('LiveGameMonitorComponent', () => {
  let component: LiveGameMonitorComponent;
  let fixture: ComponentFixture<LiveGameMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveGameMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveGameMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
