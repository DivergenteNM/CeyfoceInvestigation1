import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/account/pages/home/home.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { ChangeRoleComponent } from './change-role/change-role.component';

const routes:Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'authorization',
        component: AuthorizationComponent
      },
      {
        path: 'changeRole',
        component: ChangeRoleComponent
      },
      {
        path: '**',
        redirectTo: 'authorization'
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
export class UsersRoutingModule { }
