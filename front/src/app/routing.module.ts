import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/guards/auth/auth.guard';
import { StudentGuard } from './components/guards/student/student.guard';
import { HomePrincipalComponent } from './components/home-principal/home-principal.component';

const auth = localStorage.getItem('auth');
const adm = localStorage.getItem('admissibleness');
const routes: Routes = [
  {
    path: '',
    component: HomePrincipalComponent,
    pathMatch: 'full',
  },
  {
    path: 'account',
    loadChildren: () => auth===null?import('./account/account.module').then(m => m.AccountModule):import('./account/account.module')
                        .then(m => {
                          adm==='sl34mdms#fgd-6'?
                          document.location.href='./student':
                          document.location.href='./platform/results';
                        })
  },
  {
    path: 'platform',
    loadChildren: () => adm!=='sl34mdms#fgd-6'?import('./platform/platform.module').then(m => m.PlatformModule):import('./platform/platform.module')
                        .then(m =>
                          document.location.href = '/'
                        ),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'student',
    loadChildren: () => adm==='sl34mdms#fgd-6'?import('./student/student.module').then(m => m.StudentModule):import('./student/student.module')
                        .then(m =>
                          document.location.href = '/'
                        ),
    canLoad: [StudentGuard],
    canActivate: [StudentGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
