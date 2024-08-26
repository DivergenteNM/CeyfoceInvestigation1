import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInstitutionComponent } from './update-institution.component';

describe('UpdateInstitutionComponent', () => {
  let component: UpdateInstitutionComponent;
  let fixture: ComponentFixture<UpdateInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateInstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
