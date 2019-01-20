// cf. https://angular.io/guide/http#testing-http-requests

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SwapiService } from './swapi.service';

import { Planet } from '../DTOs/planet';
import { PagedResponse } from '../DTOs/planetsResponse';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';
import { CachedSwapiService } from './cached-swapi.service';
import { MockSwapiService } from '../mockServices/swapi.service.mock';

describe('CachedSwapiService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let swapiService: SwapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      // Provide the service-under-test and its dependencies
      providers: [
        SwapiService,
        HttpErrorHandler,
        MessageService
      ]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getAllThings', () => {
    let expectedPlanet: Planet;
    let expectedPlanets: Planet[];
    let planetsUrl: string;

    beforeEach(() => {
      swapiService = TestBed.get(SwapiService);
      planetsUrl = `${swapiService.swapiUrl}/planets`;
      expectedPlanet = <Planet>{ name: 'Mars' };
      expectedPlanets = [
         { name: 'Mars' },
         { name: 'Venus' },
      ] as Planet[];
    });

    it('should return expected planet (called once)', () => {
      swapiService.getAllThingsInChunks<Planet>('planets')
      .subscribe(
        planets => {
          expect(planets).toEqual(expectedPlanets, 'should return expected planets');
        },
        fail
      );

      // SwapiService should have made one request to GET planets from expected URL
      const req = httpTestingController.expectOne(planetsUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual(planetsUrl);

      req.flush(expectedPlanets); // Respond / cause Observable to resolve
    });
  });

  describe('getFirstPageOfThings', () => {
    let expectedPlanets: Planet[];
    let planetsUrl: string;
    let expectedResponse: PagedResponse<Planet>;

    beforeEach(() => {
      swapiService = TestBed.get(SwapiService);
      planetsUrl = `${swapiService.swapiUrl}/planets`;
      expectedPlanets = [
         { name: 'Mars' },
         { name: 'Venus' },
      ] as Planet[];
      expectedResponse = <PagedResponse<Planet>>{
        count: 2,
        next: null,
        previous: null,
        results: expectedPlanets
      }
    });

    it('should return expected planets', () => {
      swapiService.getFirstPageOfThings<Planet>('planets', 1)
      .subscribe(
        planet => {
          expect(planet.results).toEqual(expectedPlanets, 'should return expected planets');
        },
        fail
      );

      // SwapiService should have made one request to GET planets from expected URL
      const req = httpTestingController.expectOne(planetsUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual(planetsUrl);

      req.flush(expectedResponse); // Trigger response / resolve Observable (and first expect() to execute)
    });
  });

  describe('getPlanet', () => {
    let expectedPlanet: Planet;
    let planetId: number = 999;
    let planetUrl: string;

    beforeEach(() => {
      swapiService = TestBed.get(SwapiService);
      planetUrl = `${swapiService.swapiUrl}/planets/${planetId}`;
      expectedPlanet = <Planet>{ name: 'Mars' };
    });
  
    it('should call /planets/id', () => {
      swapiService.getPlanet(planetId).subscribe(
        planet => {
          expect(planet).toEqual(expectedPlanet, 'should return expected planet');
        },
        fail
      );

      // SwapiService should have made one request to GET planets from expected URL
      const req = httpTestingController.expectOne(planetUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual(planetUrl);

      // Respond with the mock planet / resolve Observable
      req.flush(expectedPlanet);
    });
  });

  describe('savePlanet', () => {
    let cachedService: CachedSwapiService;
    let http: HttpClient;
    let httpErrorHandler: HttpErrorHandler;

    // it('persists an existing planet', () => {
      

    // });

    // it('fails to persist a new planet with the name of an existing planet', () => {
      

    // });

    // it('persists planet with a changed but existing name', () => {
      

    // });
  });
})