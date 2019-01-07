import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { Planet } from '../DTOs/planet';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.scss']
})
export class PlanetsComponent implements OnInit, OnDestroy {
  sortedPlanets: Planet[];
  private ngUnsubscribe = new Subject();

  constructor(private swapiService : SwapiService,
        private router: Router) { 
    //console.log(swapiService);
  }

  ngOnInit() {
    this.getAllPlanets();
  }

  ngOnDestroy() {
    https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription/41177163#41177163
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAllPlanets() {
    let planetSort = (x: Planet, y: Planet) => x.name < y.name ? -1 : 1;
    this.sortedPlanets = [];
    (this.swapiService).getAllThings<Planet>('planets')
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
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
