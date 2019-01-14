import { Injectable } from '@angular/core';
import { PlanetsResponse, PagedResponse } from '../DTOs/planetsResponse';
import { forkJoin, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Planet } from '../DTOs/planet';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { ContentObserver } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class SwapiService implements ISwapiService {
  swapiUrl = 'https://swapi.co/api';
  private handleError: HandleError;

  constructor(private http: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('SwapiService');
  }

  getPlanets(page: number): Observable<PlanetsResponse> {
    let url = `${this.swapiUrl}/planets`;
    if (page > 1) {
      url = `${url}/?page=${page}`;
    }
    return this.http.get<PlanetsResponse>(url);
  }

  getAllPlanets() : Observable<Planet> {
    let url = `${this.swapiUrl}/planets`;
    let planets = new Subject<Planet>();

    this.getPlanets(1)
    .subscribe(response => {
      response.results.forEach(p => {
        planets.next(p);
      });
      let pageSize = response.results.length;

      var pageCount = response.count / pageSize;
      if (response.count % pageSize > 0)
      {
          pageCount += 1;
      }

      let observables: Observable<PlanetsResponse>[] = [];
      for (var pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
        let pageUrl = `${url}/?page=${pageNumber}`;
        let observable: Observable<PlanetsResponse> = this.http.get<PlanetsResponse>(pageUrl);
        observables.push(observable);
      }

      forkJoin(observables)
      .subscribe(responses => {
        for (var pageNumber = 0; pageNumber < pageCount - 2; pageNumber++) {
          //console.log(`Page ${pageNumber}`, responses[pageNumber]);
          responses[pageNumber].results.forEach(p => {
            planets.next(p);
          })
        }
      });
    });
    return planets.asObservable();
  }

  getFirstPageOfThings<T>(urlExtension: string, page: number) : Observable<PagedResponse<T>>{
    let url = `${this.swapiUrl}/${urlExtension}`;
    if (page > 1) {
      url = `${url}/?page=${page}`;
    }
    return this.http.get<PagedResponse<T>>(url);
  }

  getAllThings<T>(urlExtension: string) : Observable<T> {
    let url = `${this.swapiUrl}/${urlExtension}`;
    let things = new Subject<T>();

    // 1. get the first page to determine the total count and page size
    this.getFirstPageOfThings<T>(urlExtension, 1)
    .subscribe(response => {
      if (!response.results) {
        console.log(response);
        return;
      }
      response.results.forEach(p => {
        things.next(p);
      });
      let pageSize = response.results.length;
      let totalCount = response.count;

      let pageCount = totalCount / pageSize;
      if (totalCount % pageSize > 0)
      {
          pageCount++;
      }

      // 2. get all remaining pages (if any) at once
      let observables: Observable<PagedResponse<T>>[] = [];
      for (var pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
        let pageUrl = `${url}/?page=${pageNumber}`;
        let observable: Observable<PagedResponse<T>> = this.http.get<PagedResponse<T>>(pageUrl);
        observables.push(observable);
      }

      forkJoin(observables) // cf. Promise.all()
      .subscribe(responses => {
        for (var pageNumber = 0; pageNumber < pageCount - 2; pageNumber++) {
          responses[pageNumber].results.forEach(p => {
            things.next(p);
          })
        }
        things.complete();
      });
    });
    return things.asObservable();
  }

  getAllThingsInChunks<T>(urlExtension: string) : Observable<T[]> {
    let url = `${this.swapiUrl}/${urlExtension}`;
    let chunks = new Subject<T[]>();

    // 1. get the first page to determine the total count and page size
    this.getFirstPageOfThings<T>(urlExtension, 1)
    .subscribe(response => {
      if (!response.results) {
        console.log(response);
        return;
      }
      chunks.next(response.results);
      let pageSize = response.results.length;
      let totalCount = response.count;

      let pageCount = totalCount / pageSize;
      if (totalCount % pageSize > 0)
      {
          pageCount++;
      }

      // 2. get all remaining pages (if any) at once
      let observables: Observable<PagedResponse<T>>[] = [];
      for (var pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
        let pageUrl = `${url}/?page=${pageNumber}`;
        let observable: Observable<PagedResponse<T>> = this.http.get<PagedResponse<T>>(pageUrl);
        observables.push(observable);
      }

      forkJoin(observables) // cf. Promise.all()
      .pipe(
        catchError(this.handleError('getAllThingsInChunks', []))
      )
      .subscribe(responses => {
        for (var pageNumber = 0; pageNumber < pageCount - 2; pageNumber++) {
          if (responses[pageNumber]) {
            chunks.next(responses[pageNumber].results);
          }
        }
        chunks.complete();
      });
    });
    return chunks.asObservable();
  }

  getAllPlanetsAtOnce() : Observable<Planet[]> {
    return Observable.create(observer => {
      let result = <Planet[]>[];
      this.getAllThingsInChunks<Planet>('planets')
      .subscribe(chunk => {
        result = [...result, ...chunk];
      },
      error => {
        console.log(error);
      },
      () => {
        // End of event stream
        observer.next(result);
      });
    });
  }

  //testPlanet = {"name":"Mon Cala","rotation_period":"21","orbital_period":"398","diameter":"11030","climate":"temperate","gravity":"1","terrain":"oceans, reefs, islands","surface_water":"100","population":"27000000000","residents":["https://swapi.co/api/people/27/"],"films":[],"created":"2014-12-18T11:07:01.792000Z","edited":"2014-12-20T20:58:18.471000Z","url":"https://swapi.co/api/planets/31/"}
  
  getPlanet(id: number): Observable<Planet> {
    // let result = this.testPlanet;
    // return Observable.create(observer => {
    //   observer.next(result);
    // });

    return this.http.get<Planet>(`${this.swapiUrl}/planets/${id}`)
    .pipe(
      // handle http errors
      catchError(this.handleError('getPlanet', <Planet>{}))
    );
  }
}

export interface ISwapiService {
  getFirstPageOfThings<T>(urlExtension: string, page: number) : Observable<PagedResponse<T>>;
  getAllThings<T>(urlExtension: string) : Observable<T>;
  getAllThingsInChunks<T>(urlExtension: string) : Observable<T[]>;
  getPlanet(id: number): Observable<Planet>;
  //savePlanet(planet: Planet): void; // No API with POST endpoint available
}