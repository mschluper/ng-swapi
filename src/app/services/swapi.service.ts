import { Injectable } from '@angular/core';
import { PlanetsResponse, PagedResponse } from '../DTOs/planetsResponse';
import { forkJoin, Observable, of, from, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Planet } from '../DTOs/planet';


@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private swapiUrl = 'https://swapi.co/api';

  constructor(private http: HttpClient) { }

  getPlanets(page: number): Observable<PlanetsResponse> {
    let url = `${this.swapiUrl}/planets`;
    if (page > 1) {
      url = `${url}/?page=${page}`;
    }
    return this.http.get<PlanetsResponse>(url);
  }

  // getAllPlanets() {
  //   let url = `${this.swapiUrl}/planets`;
  //   let planets = new Subject();

  //   this.getPlanets(1)
  //   .subscribe(response => {
  //     response.results.forEach(p => {
  //       planets.next(p);
  //     });
  //     let pageSize = response.results.length;

  //     var pageCount = response.count / pageSize;
  //     if (response.count % pageSize > 0)
  //     {
  //         pageCount += 1;
  //     }

  //     let observables: Observable<PlanetsResponse>[] = [];
  //     for (var pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
  //       let pageUrl = `${url}/?page=${pageNumber}`;
  //       let observable: Observable<PlanetsResponse> = this.http.get<PlanetsResponse>(pageUrl);
  //       observables.push(observable);
  //     }

  //     forkJoin(observables)
  //     .subscribe(responses => {
  //       for (var pageNumber = 0; pageNumber < pageCount - 2; pageNumber++) {
  //         //console.log(`Page ${pageNumber}`, responses[pageNumber]);
  //         responses[pageNumber].results.forEach(p => {
  //           planets.next(p);
  //         })
  //       }
  //     });
  //   });
  //   return planets;
  // }

  getThings<T>(urlExtension: string, page: number) {
    let url = `${this.swapiUrl}/${urlExtension}`;
    if (page > 1) {
      url = `${url}/?page=${page}`;
    }
    return this.http.get<PagedResponse<T>>(url);
  }

  getAllThings<T>(urlExtension: string) {
    let url = `${this.swapiUrl}/${urlExtension}`;
    let things = new Subject();

    // 1. get the first page to determine the total count and page size
    this.getThings<T>(urlExtension, 1)
    .subscribe(response => {
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
      });
    });
    return things;
  }

  getPlanet(id: number): Observable<Planet> {
    return this.http.get<Planet>(`${this.swapiUrl}/planets/${id}`);
  }
}