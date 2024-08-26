import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalesResultsComponent } from './scales-results.component';

describe('ScalesResultsComponent', () => {
  let component: ScalesResultsComponent;
  let fixture: ComponentFixture<ScalesResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalesResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
