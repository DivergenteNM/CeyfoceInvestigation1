import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { AnswerComponent } from './pages/answer/answer.component';
import { BeginningComponent } from './pages/beginning/beginning.component';
import { ScalesComponent } from './pages/scales/scales.component';

const routes:Routes = [
    {
      path: '',
      component: HomeComponent,
      children: [
        {
          path: '',
          component: BeginningComponent
        },
        {
          path: 'scales',
          component: ScalesComponent
        },
        {
          path: 'answer/:idScale',
          component: AnswerComponent
        },
        {
          path: 'profile',
          component: ProfileComponent
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
  export class StudentRoutingModule { }
  