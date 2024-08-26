import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';
import { OnlyAdminGuard } from './guards/only-admin.guard';
import { HomeComponent } from './pages/home/home.component';
import { IndividualResultsComponent } from './pages/individual-results/individual-results.component';
import { ScalesCreateComponent } from './pages/scales-create/scales-create.component';
import { ScalesEditComponent } from './pages/scales-edit/scales-edit.component';
import { ScalesResultsComponent } from './pages/scales-results/scales-results.component';

const routes:Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'scales/create',
        component: ScalesCreateComponent,
        canLoad: [OnlyAdminGuard],
        canActivate: [OnlyAdminGuard]
      },
      {
        path: 'scales/edit',
        component: ScalesEditComponent,
        canLoad: [OnlyAdminGuard],
        canActivate: [OnlyAdminGuard]
      },
      {
        path: 'scales/results',
        component: ScalesResultsComponent
      },
      {
        path: 'scales/resultsIndividual',
        component: IndividualResultsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'institutions',
        loadChildren: ()=>import('./pages/institutions/institutions.module').then(m=>m.InstitutionsModule),
        canLoad: [OnlyAdminGuard],
        canActivate: [OnlyAdminGuard]
      },
      {
        path: 'users',
        loadChildren: ()=>import('./pages/users/users.module').then(m=>m.UsersModule)
      },
      {
        path: '**',
        redirectTo: 'scales/results'
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
export class PlatformRoutingModule { }
