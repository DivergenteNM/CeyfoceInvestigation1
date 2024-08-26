import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalesEditComponent } from './scales-edit.component';

describe('ScalesEditComponent', () => {
  let component: ScalesEditComponent;
  let fixture: ComponentFixture<ScalesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});