import { Injectable } from '@angular/core';
import { PlanetsResponse, PagedResponse } from '../DTOs/planetsResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Planet } from '../DTOs/planet';
import { MessageService, MessageType } from './message.service';
import { ICachedSwapiService } from './iswapi.service';
import { SwapiService } from './swapi.service';

@Injectable({
  providedIn: 'root'
})
export class CachedSwapiService implements ICachedSwapiService {
  swapiUrl = 'https://swapi.co/api';
  private cache = {
    planets: <Planet[]>[]
  }

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private swapiService: SwapiService) {
  }

  getFirstPageOfThings<T>(urlExtension: string, page: number) : Observable<PagedResponse<T>>{
    if (urlExtension === 'planets' && this.cache.planets.length) {
      return Observable.create(observer => {
        observer.next(this.cache.planets);
      });
    } else {
      return this.swapiService.getFirstPageOfThings<T>(urlExtension, page);
    }
  }

  getAllThings<T>(urlExtension: string) : Observable<T> {
    if (urlExtension === 'planets' && this.cache.planets.length) {
      return Observable.create(observer => {
        observer.next(this.cache.planets);
      });
    } else {
      return this.swapiService.getAllThings<T>(urlExtension);
    }
  }

  getAllThingsInChunks<T>(urlExtension: string) : Observable<T[]> {
    if (urlExtension === 'planets' && this.cache.planets.length) {
      return Observable.create(observer => {
        observer.next(this.cache.planets);
      });
    } else {
      //return this.swapiService.getAllThingsInChunks<T>(urlExtension);
      return Observable.create(observer => {
        this.swapiService.getAllThingsInChunks<T>(urlExtension)
        .subscribe(ch => {
          if (urlExtension === 'planets') {
            this.cache.planets = [...this.cache.planets, ...<Planet[]><unknown>ch];
          }
          observer.next(ch);
        });
      });
    }
  }

  getAllPlanetsAtOnce() : Observable<Planet[]> {
    if (this.cache.planets.length) {
      return Observable.create(observer => {
        observer.next(this.cache.planets);
      });
    } else {
      return Observable.create(observer => {
        this.swapiService.getAllPlanetsAtOnce()
        .subscribe(planets => {
          this.cache.planets = planets;
          observer.next(planets);
        },
        error => {
          console.log(error);
        });
      });
    }
  }

  //testPlanet = {"name":"Mon Cala","rotation_period":"21","orbital_period":"398","diameter":"11030","climate":"temperate","gravity":"1","terrain":"oceans, reefs, islands","surface_water":"100","population":"27000000000","residents":["https://swapi.co/api/people/27/"],"films":[],"created":"2014-12-18T11:07:01.792000Z","edited":"2014-12-20T20:58:18.471000Z","url":"https://swapi.co/api/planets/31/"}
  
  getPlanet(id: number): Observable<Planet> {
    let planet: Planet;
    if (this.cache.planets.length) {
      planet = this.cache.planets.find(p => p.id === id);
    }
    if (planet) {
      return Observable.create(observer => {
        observer.next(planet);
      });
    } else {
      return this.swapiService.getPlanet(id);
    }
  }

  getPlanetById(id: number): Observable<Planet> {
    return this.getPlanet(id);
  }

  savePlanet(planet: Planet): Observable<number> {
    // Still no backend that can actually save changes, so need to ensure cache is filled
    return Observable.create(observer => {
      this.getAllPlanetsAtOnce()
      .subscribe(planets => {
        this.cache.planets = planets;
        let sameNamedPlanet = this.cache.planets.find(p => p.name === planet.name);
        if ((planet.id < 0 && sameNamedPlanet)                            // new planet w/ name that is already taken
            || (planet.id > 0 && sameNamedPlanet && planet.id !== sameNamedPlanet.id)) {     // existing planet given name that is already taken
          this.messageService.add(MessageType.error, `Planet ${planet.name} already exists. Either choose another name or update the existing planet. `);
          return;
        }
        sameNamedPlanet = Object.assign({}, sameNamedPlanet, planet);
        //sameNamedPlanet.terrain = planet.terrain; etc
        this.swapiService.savePlanet(planet)
        .subscribe(nr => {
          observer.next(nr);
        })
      })
    })
  }
}
