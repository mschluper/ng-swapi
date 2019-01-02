import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanetsComponent }      from './planets/planets.component';
import { VehiclesComponent }     from './vehicles/vehicles.component';
import { PeopleComponent }       from './people/people.component';
import { PlanetDetailComponent } from './planet-detail/planet-detail.component';

const routes: Routes = [
  //{ path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'planets/:id', component: PlanetDetailComponent },
  { path: 'planets', component: PlanetsComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'people', component: PeopleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
