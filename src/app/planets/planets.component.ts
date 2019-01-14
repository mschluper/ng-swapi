import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { Planet } from '../DTOs/planet';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.scss']
})
export class PlanetsComponent implements OnInit, OnDestroy {
  private planetSort = (x: Planet, y: Planet) => x.name < y.name ? -1 : 1;
  sortedPlanets: Planet[];
  private ngUnsubscribe = new Subject();

  constructor(private swapiService : SwapiService,
        private router: Router,
        private cacheService: CacheService) {
  }

  ngOnInit() {
    if (this.cacheService.isFilled()) {
      this.sortedPlanets = this.cacheService.planets.sort(this.planetSort);
    } else {
      this.getAllPlanets();
    }
  }

  ngOnDestroy() {
    https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription/41177163#41177163
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAllPlanets() {
    this.sortedPlanets = [];
    (this.swapiService).getAllThingsInChunks<Planet>('planets')
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe(planets => {
      planets.forEach(planet => planet.id = this.getPlanetId(planet.url))
      this.sortedPlanets.splice(0,0,...planets);
      this.sortedPlanets.sort(this.planetSort);
      this.cacheService.persistPlanets(this.sortedPlanets.slice());
    });
  }

  onSelect(selectedPlanet: Planet) {
    if (!selectedPlanet.id) {
      let parts = selectedPlanet.url.split("/");
      if (parts.length < 2) return;
      selectedPlanet.id = +parts[parts.length-2];
    }
    this.router.navigate([`planets/${selectedPlanet.id}`]);
  }

  private getPlanetId(url) : number {
    let parts = url.split("/");
    if (parts.length < 2) return;
    let id = +parts[parts.length-2];
    return id;
  }
}
