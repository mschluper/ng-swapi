import { Injectable } from '@angular/core';
import { PlanetsResponse, PagedResponse } from '../DTOs/planetsResponse';
import { Observable, of, Subject } from 'rxjs';
import { Person } from '../DTOs/person';
import { Planet } from '../DTOs/planet';
import { Vehicle } from '../DTOs/vehicle';
import { ISwapiService } from '../services/iswapi.service';


@Injectable({
  providedIn: 'root'
})
export class MockSwapiService implements ISwapiService {
  swapiUrl = 'https://swapi.co/api';
  mockPlanetsResponse = {
    count: 1,
    next: '',
    previous: '',
    results: [<Planet>{ name: 'Mars', url: 'prefix/123'}, <Planet>{ name: 'Venus', url: 'prefix/456'}]
  };
  mockPeopleResponse = {
    count: 1,
    next: '',
    previous: '',
    results: [<Person>{ name: 'Ashley' }, <Person>{ name: 'June'}]
  };
  mockVehiclesResponse = {
    count: 1,
    next: '',
    previous: '',
    results: [<Vehicle>{ name: 'Car' }, <Vehicle>{ name: 'Truck'}]
  };

  constructor() {}

  private getResponse(urlExtension: string) {
    let response;
    switch (urlExtension) {
      case 'planets':
        response = this.mockPlanetsResponse;
        break;
      case 'people':
        response = this.mockPeopleResponse;
        break;
      case 'vehicles':
        response = this.mockVehiclesResponse;
        break;
      default:
        break;
    }
    return response;
  }

  getFirstPageOfThings<T>(urlExtension: string, page: number) : Observable<PagedResponse<T>>{
    let response = this.getResponse(urlExtension);
    return of(response);
  }

  getAllThings<T>(urlExtension: string) : Observable<T> {
    let response = this.getResponse(urlExtension).results;
    console.log('MOCK:', response);
    let subject = new Subject<T>();
    response.forEach(thing => {
      subject.next(thing);
      console.log(`Called next() to add ${thing.name} to observable array`);
    })
    return subject.asObservable();
  }

  getAllThingsInChunks<T>(urlExtension: string) : Observable<T[]> {
    let response = this.getResponse(urlExtension).results;
    return of(response);
  }

  getPlanet(id: number): Observable<Planet> {
    let planet : Planet = <Planet>{
      name: 'Neptune'
    }
    return of(planet);
  }

  savePlanet(planet: Planet): Observable<number> {
    return of(42);
  }

  getAllPlanetsAtOnce() : Observable<Planet[]> {
    let planets = <Planet[]>this.getResponse('planets').results;
    return of(planets);
  }
}