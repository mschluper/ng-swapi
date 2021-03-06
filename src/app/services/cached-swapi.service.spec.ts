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
  //let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let cachedSwapiService: CachedSwapiService; // sut
  let messageService: jasmine.SpyObj<MessageService>;
  let getPlanetSpy: jasmine.Spy = jasmine.createSpy("getPlanet");
  let savePlanetSpy: jasmine.Spy = jasmine.createSpy("savePlanet");
  let addMessageSpy: jasmine.Spy = jasmine.createSpy("add");
  let getAllPlanetsAtOnceSpy: jasmine.Spy = jasmine.createSpy("getAllPlanetsAtOnce");
  let getAllThingsInChunksSpy: jasmine.Spy = jasmine.createSpy("getAllThingsInChunks");

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      
      // Provide the service-under-test and its dependencies
      providers: [
        CachedSwapiService,
        HttpErrorHandler,
        { 
          provide: SwapiService, 
          useClass: class { 
            getPlanet = getPlanetSpy; 
            savePlanet = savePlanetSpy;
            getAllPlanetsAtOnce = getAllPlanetsAtOnceSpy;
            getAllThingsInChunks = getAllThingsInChunksSpy;
          }
        },
        { 
          provide: MessageService, 
          useClass: class { 
            add = addMessageSpy;
          }
        },
      ]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
        //httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    cachedSwapiService = TestBed.get(CachedSwapiService);
    messageService = TestBed.get(MessageService);    
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getAllThingsInChunks', () => {

    afterEach(() => {
      getAllThingsInChunksSpy.calls.reset();
    });

    it('should call SwapiService if cache is empty', () => {
      cachedSwapiService.getAllThingsInChunks('planets')
      .subscribe(planets => {});
      expect(getAllThingsInChunksSpy).toHaveBeenCalled();
    });

    it('should not call SwapiService if cache is not empty', () => {
      let planet = <Planet>{
        id: 984,
        name: 'Mars'
      }
      cachedSwapiService.insertPlanetIntoCacheForTestingPurposes(planet);
      cachedSwapiService.getAllThingsInChunks('planets')
      .subscribe(planets => {});
      expect(getAllThingsInChunksSpy).not.toHaveBeenCalled();
    });

    it('should get the planet(s) from cache if cache is not empty', () => {
      let mars = <Planet>{
        id: 985,
        name: 'Mars'
      }
      let planets;
      cachedSwapiService.insertPlanetIntoCacheForTestingPurposes(mars);
      cachedSwapiService.getAllThingsInChunks('planets')
      .subscribe(plnts => {
        planets = plnts;
      });
      expect(planets).toBeTruthy();
      expect(planets.length).toEqual(1);
      expect(planets[0]).toEqual(mars);
    });
  })

  describe('getAllPlanetsAtOnce', () => {
    afterEach(() => {
      getAllPlanetsAtOnceSpy.calls.reset();
    });

    it('should call SwapiService if cache is empty', () => {
      cachedSwapiService.getAllPlanetsAtOnce()
      .subscribe(planets => {});
      expect(getAllPlanetsAtOnceSpy).toHaveBeenCalled();
    });

    it('should not call SwapiService if cache is not empty', () => {
      let planet = <Planet>{
        id: 986,
        name: 'Mars'
      }
      cachedSwapiService.insertPlanetIntoCacheForTestingPurposes(planet);
      cachedSwapiService.getAllPlanetsAtOnce()
      .subscribe(planets => {});
      expect(getAllPlanetsAtOnceSpy).not.toHaveBeenCalled();
    });

    it('should get the planet(s) from cache if cache is not empty', () => {
      let mars = <Planet>{
        id: 987,
        name: 'Mars'
      }
      let planets;
      cachedSwapiService.insertPlanetIntoCacheForTestingPurposes(mars);
      cachedSwapiService.getAllPlanetsAtOnce()
      .subscribe(plnts => {
        planets = plnts;
      });
      expect(planets).toBeTruthy();
      expect(planets.length).toEqual(1);
      expect(planets[0]).toEqual(mars);
    });
  })

  describe('getPlanet', () => {
    let planetId: number = 999;

    beforeEach(() => {
    });

    afterEach(() => {
      getPlanetSpy.calls.reset();
    });
  
    it('should call SwapiService if cache is empty', () => {
      cachedSwapiService.getPlanet(planetId);
      expect(getPlanetSpy).toHaveBeenCalledWith(planetId);
    });

    it('should not call SwapiService if cache contains planet', () => {
      let planet = <Planet>{
        id: planetId,
        name: 'Mars'
      }
      cachedSwapiService.insertPlanetIntoCacheForTestingPurposes(planet);
      cachedSwapiService.getPlanet(planetId);
      expect(getPlanetSpy).not.toHaveBeenCalledWith(planetId);
    });
  });

  describe('savePlanet', () => {
    let planetId: number = 42;
    let earth: Planet;

    beforeEach(() => {
      earth = <Planet>{
        id: planetId,
        name: 'Earth',
        climate: 'OK'
      }
      cachedSwapiService.insertPlanetIntoCacheForTestingPurposes(earth);
    });

    afterEach(() => {
      savePlanetSpy.calls.reset();
      addMessageSpy.calls.reset();
    });

    it('persists an existing planet', () => {
      earth.climate = 'perfect';
      cachedSwapiService.savePlanet(earth)
      .subscribe(nr => {});
      expect(savePlanetSpy).toHaveBeenCalledWith(earth);
      expect(addMessageSpy).not.toHaveBeenCalled();
    });

    it('fails to persist a new planet with the name of an existing planet', () => {
      let pluto = <Planet>{
        id: 999,
        name: 'Earth'
      }
      cachedSwapiService.savePlanet(pluto)
      .subscribe(nr => {});
      expect(savePlanetSpy).not.toHaveBeenCalledWith(pluto);
      expect(addMessageSpy).toHaveBeenCalledWith(2, 'Planet Earth already exists. Either choose another name or update the existing planet. ');
    });

    it('fails to persist a planet with a name changed to the name of another planet', () => {
      let pluto = <Planet>{
        id: 999,
        name: 'Pluto'
      }
      cachedSwapiService.insertPlanetIntoCacheForTestingPurposes(pluto);
      let planet = <Planet>{
        id: planetId,
        name: 'Pluto'
      }
      cachedSwapiService.savePlanet(planet)
      .subscribe(nr => {});
      expect(savePlanetSpy).not.toHaveBeenCalled();
      expect(addMessageSpy).toHaveBeenCalledWith(2, 'Planet Pluto already exists. Either choose another name or update the existing planet. ');
    });
  });



  // alternative approach shown in https://angular.io/guide/testing "Testing without beforeEach()"
  function setup() {
    const messageServiceSpy =
      jasmine.createSpyObj('MessageService', ['getPlanet']);
    const swapiServiceSpy =
      jasmine.createSpyObj('SwapiService', ['getPlanet']);
    const stubValue = <Planet>{ name: 'Mars' };
    const cachedSwapiService = new CachedSwapiService(messageServiceSpy, swapiServiceSpy);
  
    swapiServiceSpy.getPlanet.and.returnValue(stubValue);
    return { cachedSwapiService, stubValue, messageServiceSpy, swapiServiceSpy };
  }
})