import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTargetsComponent } from './live-targets.component';

describe('LiveTargetsComponent', () => {
  let component: LiveTargetsComponent;
  let fixture: ComponentFixture<LiveTargetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveTargetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
