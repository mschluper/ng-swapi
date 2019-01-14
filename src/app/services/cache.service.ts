import { Injectable } from '@angular/core';
import { Planet } from '../DTOs/planet';

/*
* Having a cache is tricky - it may get stale.
* Here I need one b/c I cannot persist anything on the SWAPI backend.
* To mimic a website where things can be created and updated, let's have a cache.
* It gets "automatically" cleared upon each new session ;)
*/

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = {
    planets: <Planet[]>[]
  }

  constructor() { }

  isFilled(): boolean {
    return this.cache.planets.length > 0;
  }

  persistPlanets(planets: Planet[]) {
    this.cache.planets = planets;
  }

  getPlanet(name: string): Planet {
    return this.cache.planets.find(p => p.name === name);
  }

  getPlanetById(id: number): Planet {
    return this.cache.planets.find(p => p.id === id);
  }

  get planets() {
    return this.cache.planets;
  }
}
