import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/account/pages/home/home.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { UpdateInstitutionComponent } from './update-institution/update-institution.component';

const routes:Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'create',
        component: InstitutionsComponent
      },
      {
        path: 'update',
        component: UpdateInstitutionComponent
      },
      {
        path: '**',
        redirectTo: 'create'
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
export class InstitutionsRoutingModule { }
