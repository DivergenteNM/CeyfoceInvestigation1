import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { RegisterHomeComponent } from './register-home/register-home.component';
import { RegisterStudentComponent } from './register-student/register-student.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterHomeComponent,
    children: [
      {
        path: 'student',
        component: RegisterStudentComponent
      },
      {
        path: 'administrator',
        component: RegisterAdminComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RegisterRoutingModule { }
