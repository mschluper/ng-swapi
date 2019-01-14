import { Component, OnInit } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { ActivatedRoute } from '@angular/router';
import { Planet } from '../DTOs/planet';
import { FormControl, Validators } from '@angular/forms';
import { CacheService } from '../services/cache.service';
import { MessageService, MessageType } from '../services/message.service';

@Component({
  selector: 'app-planet-detail',
  templateUrl: './planet-detail.component.html',
  styleUrls: ['./planet-detail.component.scss']
})
export class PlanetDetailComponent implements OnInit {
  planet: Planet;
  readOnly: boolean = true;
  percentages = [];
  nameFormControl = new FormControl('', [
    Validators.required
  ]);
  planetId: number = -1;

  constructor(private route: ActivatedRoute,
              private swapiService: SwapiService,
              private cacheService: CacheService,
              private messageService: MessageService) {}

  ngOnInit(): void {
    this.getPlanet();
    for (let i = 0; i <= 100; i++) {
      this.percentages.push({value: `${i}`, viewValue: `${i}`})
    }
  }

  enableEdit(): void {
    this.readOnly = false;
  }
 
  getPlanet(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (!id) {
      // It's a new planet to be created
      this.readOnly = false;
      this.planet = new Planet();
      this.planet.id = this.planetId--;
      return;
    }
    let cachedPlanet = this.cacheService.getPlanetById(id);
    if (cachedPlanet) {
      this.planet = cachedPlanet;
      return;
    }
    // It's an existing planet that's not cached
    this.swapiService.getPlanet(id)
      .subscribe(planet => {
        this.planet = planet;
      });
  }

  saveThePlanet(): void {
    if (!this.planet.name || !this.planet.name.length) {
      // This should never happen - the UI should catch this.
      this.messageService.add(MessageType.error, 'A planet name is required.')
      return;
    }
    if (!this.cacheService.isFilled()) {
      this.swapiService.getAllPlanetsAtOnce()
      .subscribe(planets => {
        this.cacheService.persistPlanets(planets);
        // planets are in cache now
        this.persistPlanetIfNew(this.planet);
      })
    } else {
      // planets are in cache
      this.persistPlanetIfNew(this.planet);
    }
  }

  // Precondition: planets are in cache
  private persistPlanetIfNew(planet: Planet) {
    let sameNamedPlanet = this.cacheService.getPlanet(planet.name);
    if ((planet.id < 0 && sameNamedPlanet)                            // new planet w/ name that is already taken
        || (planet.id > 0 && planet.id !== sameNamedPlanet.id)) {     // existing planet given name that is already taken
      this.messageService.add(MessageType.error, `Planet ${planet.name} already exists. Either choose another name or update the existing planet. `);
      return;
    }
    sameNamedPlanet.terrain = planet.terrain;
  }
}
