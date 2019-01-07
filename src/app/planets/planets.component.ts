import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { Planet } from '../DTOs/planet';
import { Router } from "@angular/router";

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.scss']
})
export class PlanetsComponent implements OnInit, OnDestroy {
  sortedPlanets: Planet[];
  //planetSubject: Observable<Planet>;

  constructor(private swapiService : SwapiService,
        private router: Router) { 
    //console.log(swapiService);
  }

  ngOnInit() {
    this.getAllPlanets();
  }

  ngOnDestroy() {
    this.sortedPlanets.length = 0;
  }

  getAllPlanets() {
    let planetSort = (x: Planet, y: Planet) => x.name < y.name ? -1 : 1;
    this.sortedPlanets = [];
    (this.swapiService).getAllThings<Planet>('planets')
    .subscribe(planet => {
      this.sortedPlanets.push(<Planet>planet);
      this.sortedPlanets.sort(planetSort);
    });
  }

  onSelect(selectedPlanet: Planet) {
    let parts = selectedPlanet.url.split("/");
    if (parts.length < 2) return;
    let id = +parts[parts.length-2];
    this.router.navigate([`planets/${id}`]);
  }
}
