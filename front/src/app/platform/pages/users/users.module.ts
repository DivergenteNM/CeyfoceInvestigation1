import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationComponent } from './authorization/authorization.component';
import { UsersRoutingModule } from './users-routing.module';
import { ChangeRoleComponent } from './change-role/change-role.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    AuthorizationComponent,
    ChangeRoleComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class UsersModule { }
