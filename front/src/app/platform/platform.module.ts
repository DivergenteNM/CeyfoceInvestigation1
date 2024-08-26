import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { PlatformRoutingModule } from './platform-routing.module';
import { ToolbarComponent } from './pages/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { MenuSideComponent } from './pages/menu-side/menu-side.component';
import { ScalesCreateComponent } from './pages/scales-create/scales-create.component';
import { ScalesEditComponent } from './pages/scales-edit/scales-edit.component';
import { ScalesResultsComponent } from './pages/scales-results/scales-results.component';
import { PreguntaComponent } from './pages/pregunta/pregunta.component';
import { FormsModule } from '@angular/forms';
import { FiltroComponent } from './pages/filtro/filtro.component';
import { ResultStudentComponent } from './pages/result-student/result-student.component';
import { ExcelComponent } from './pages/excel/excel.component';
import { InstitutionsModule } from './pages/institutions/institutions.module';
import { UsersModule } from './pages/users/users.module';
import { GraphComponent } from './pages/graph/graph.component';
import { IndividualGraphComponent } from './pages/individual-graph/individual-graph.component';
import { ChartsModule } from 'ng2-charts';
import { IndividualResultsComponent } from './pages/individual-results/individual-results.component';

@NgModule({
  declarations: [
    HomeComponent,
    ToolbarComponent,
    MenuSideComponent,
    ScalesCreateComponent,
    ScalesEditComponent,
    ScalesResultsComponent,
    PreguntaComponent,
    FiltroComponent,
    ResultStudentComponent,
    ExcelComponent,
    GraphComponent,
    IndividualGraphComponent,
    IndividualResultsComponent
  ],
  exports: [
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    PlatformRoutingModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    InstitutionsModule,
    UsersModule,
    ChartsModule,
  ]
})
export class PlatformModule { }
