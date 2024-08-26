import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionsComponent } from './institutions/institutions.component';
import { UpdateInstitutionComponent } from './update-institution/update-institution.component';
import { FormsModule } from '@angular/forms';
import { InstitutionsRoutingModule } from './institutions-routing.module';


@NgModule({
  declarations: [
    InstitutionsComponent,
    UpdateInstitutionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InstitutionsRoutingModule
  ]
})
export class InstitutionsModule { }
