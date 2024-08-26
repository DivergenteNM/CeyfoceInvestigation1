import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterHomeComponent } from './register-home/register-home.component';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { RegisterRoutingModule } from './register-routing.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    RegisterHomeComponent,
    RegisterStudentComponent,
    RegisterAdminComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    MaterialModule
  ]
})
export class RegisterModule { }
