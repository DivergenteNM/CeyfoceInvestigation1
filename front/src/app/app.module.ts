import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { RoutingModule } from './routing.module';
import { HomePrincipalComponent } from './components/home-principal/home-principal.component';
import { HttpClientModule } from '@angular/common/http'; 
import { DialogContent, ToolbarComponent } from './components/toolbar/toolbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MaterialModule } from './material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HeaderPrincipalComponent } from './components/carousel/header-principal/header-principal.component';
import { InstrumentosMedicionComponent } from './components/carousel/instrumentos-medicion/instrumentos-medicion.component';
import { RepositorioDigitalComponent } from './components/carousel/repositorio-digital/repositorio-digital.component';
import { ServiciosComponent } from './components/carousel/servicios/servicios.component';
import { ProyectosComponent } from './components/carousel/proyectos/proyectos.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    HomePrincipalComponent,
    ProfileComponent,
    DialogContent,
    CarouselComponent, 
    HeaderPrincipalComponent,
    InstrumentosMedicionComponent,
    RepositorioDigitalComponent,
    ServiciosComponent,
    ProyectosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    RoutingModule,
    HttpClientModule,
    MaterialModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
