import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexichartComponent } from './flexichart.component';

describe('FlexichartComponent', () => {
  let component: FlexichartComponent;
  let fixture: ComponentFixture<FlexichartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexichartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexichartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
