import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentosMedicionComponent } from './instrumentos-medicion.component';

describe('InstrumentosMedicionComponent', () => {
  let component: InstrumentosMedicionComponent;
  let fixture: ComponentFixture<InstrumentosMedicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentosMedicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentosMedicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
export { InstrumentosMedicionComponent };

