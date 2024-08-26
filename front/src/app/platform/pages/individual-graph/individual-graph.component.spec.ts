import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualGraphComponent } from './individual-graph.component';

describe('IndividualGraphComponent', () => {
  let component: IndividualGraphComponent;
  let fixture: ComponentFixture<IndividualGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
