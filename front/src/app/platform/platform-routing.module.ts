import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';
import { OnlyAdminGuard } from './guards/only-admin.guard';
import { HomeComponent } from './pages/home/home.component';
import { IndividualResultsComponent } from './pages/individual-results/individual-results.component';
import { ScalesCreateComponent } from './pages/scales-create/scales-create.component';
import { ScalesEditComponent } from './pages/scales-edit/scales-edit.component';
import { ScalesResultsComponent } from './pages/scales-results/scales-results.component';
import { AuthGuard } from './guards/auth.guards';  // Importa AuthGuard
import { ExcelComponent } from './pages/excel/excel.component';
import { HomePrincipalComponent } from '../components/home-principal/home-principal.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomePrincipalComponent
      },
      {
        path: 'scales/excel',
        component: ExcelComponent,
        canLoad: [OnlyAdminGuard], // Requiere autenticación y ser admin
        canActivate: [OnlyAdminGuard]
      },
      {
        path: 'scales/create',
        component: ScalesCreateComponent,
        canLoad: [OnlyAdminGuard], // Requiere autenticación y ser admin
        canActivate: [OnlyAdminGuard]
      },
      {
        path: 'scales/edit',
        component: ScalesEditComponent,
        canLoad: [OnlyAdminGuard], // Requiere autenticación y ser admin //AuthGuard
        canActivate: [OnlyAdminGuard]
      },
      {
        path: 'scales/results',
        component: ScalesResultsComponent,
        canLoad: [OnlyAdminGuard], // Requiere autenticación y ser admin //AuthGuard
        //canActivate: [AuthGuard] // Solo requiere autenticación
      },
      {
        path: 'scales/resultsIndividual',
        component: IndividualResultsComponent,
        canLoad: [OnlyAdminGuard], // Requiere autenticación y ser admin //AuthGuard
        //canActivate: [AuthGuard] // Solo requiere autenticación
        
      },
      {
        path: 'profile',
        component: ProfileComponent,
        //canActivate: [AuthGuard] // Solo requiere autenticación
      },
      {
        path: 'institutions',
        loadChildren: () => import('./pages/institutions/institutions.module').then(m => m.InstitutionsModule),
        canLoad: [OnlyAdminGuard],
        canActivate: [OnlyAdminGuard] // Requiere autenticación y ser admin //AuthGuard
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
        //canLoad: [OnlyAdminGuard], //AuthGuard
        //canActivate: [AuthGuard]
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
