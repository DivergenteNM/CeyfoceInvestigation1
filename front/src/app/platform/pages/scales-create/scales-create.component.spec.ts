import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalesCreateComponent } from './scales-create.component';

describe('ScalesCreateComponent', () => {
  let component: ScalesCreateComponent;
  let fixture: ComponentFixture<ScalesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalesCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
