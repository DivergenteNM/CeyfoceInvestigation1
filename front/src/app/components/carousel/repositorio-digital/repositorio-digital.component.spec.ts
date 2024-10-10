import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositorioDigitalComponent } from './repositorio-digital.component';

describe('RepositorioDigitalComponent', () => {
  let component: RepositorioDigitalComponent;
  let fixture: ComponentFixture<RepositorioDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepositorioDigitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositorioDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
