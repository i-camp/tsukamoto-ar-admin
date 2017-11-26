import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableTargetsComponent } from './editable-targets.component';

describe('EditableTargetsComponent', () => {
  let component: EditableTargetsComponent;
  let fixture: ComponentFixture<EditableTargetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableTargetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
