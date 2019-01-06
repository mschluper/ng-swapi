import { Injectable } from '@angular/core';
import { PlanetsResponse, PagedResponse } from '../DTOs/planetsResponse';
import { forkJoin, Observable, of, from, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Person } from '../DTOs/person';
import { Planet } from '../DTOs/planet';
import { Vehicle } from '../DTOs/vehicle';
import { ISwapiService } from '../services/swapi.service';


@Injectable({
  providedIn: 'root'
})
export class MockSwapiService implements ISwapiService {
  swapiUrl = 'https://swapi.co/api';

  constructor(private http: HttpClient) { }

  getFirstPageOfThings<T>(urlExtension: string, page: number) : Observable<PagedResponse<T>>{
    let response;
    switch (urlExtension) {
      case 'planets':
        response = {
            count: 1,
            next: '',
            previous: '',
            results: [<Planet>{ name: 'Mars' }, <Planet>{ name: 'Venus'}]
        };
        break;
      case 'people':
        response = {
          count: 1,
          next: '',
          previous: '',
          results: [<Person>{ name: 'Ashley' }, <Person>{ name: 'June'}]
        };
        break;
      case 'vehicles':
        response = {
          count: 1,
          next: '',
          previous: '',
          results: [<Vehicle>{ name: 'Car' }, <Vehicle>{ name: 'Truck'}]
        };
        break;
      default:
        break;
    }
    return of(response);
  }

  getAllThings<T>(urlExtension: string) : Subject<T> {
    let things = new Subject<T>();
    let firstPage = this.getFirstPageOfThings<T>(urlExtension, 1);
    firstPage.subscribe(p => {
      p.results.forEach(e => {
        things.next(e);
      })
    });
    return things;
  }

  getPlanet(id: number): Observable<Planet> {
    let planet : Planet = <Planet>{
      name: 'Neptune'
    }
    return of(planet);
  }
}