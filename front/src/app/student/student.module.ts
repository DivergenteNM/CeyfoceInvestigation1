import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ScalesComponent } from './pages/scales/scales.component';
import { StudentRoutingModule } from './student-routing.module';
import { AnswerComponent } from './pages/answer/answer.component';
import { ToolbarComponent } from './pages/toolbar/toolbar.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { BeginningComponent } from './pages/beginning/beginning.component'


@NgModule({
  declarations: [
    HomeComponent,
    ScalesComponent,
    AnswerComponent,
    ToolbarComponent,
    BeginningComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class StudentModule { }
