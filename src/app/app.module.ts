import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgMaterialModule } from './ng-material'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { HttpClientModule }    from '@angular/common/http';
import { PlanetsComponent } from './planets/planets.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { PeopleComponent } from './people/people.component';
import { PlanetDetailComponent } from './planet-detail/planet-detail.component';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';

@NgModule({
  declarations: [
    AppComponent,
    PlanetsComponent,
    VehiclesComponent,
    PeopleComponent,
    PlanetDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgMaterialModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpErrorHandler, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
