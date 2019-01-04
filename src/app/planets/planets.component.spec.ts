import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsComponent } from './planets.component';
import { HttpClientModule } from '@angular/common/http';
import { SwapiService } from '../services/swapi.service';
import { Router } from "@angular/router";
import { Planet } from '../DTOs/planet';

describe('PlanetsComponent', () => {
  let component: PlanetsComponent;
  let fixture: ComponentFixture<PlanetsComponent>;
  let navigateSpy: jasmine.Spy = jasmine.createSpy("navigate");
  let backendSpy: jasmine.Spy = jasmine.createSpy();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SwapiService, { 
        provide: Router, 
        useClass: class { navigate = navigateSpy; } 
      }],
      declarations: [ PlanetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should navigate to planet on selection of planet', () => {
    let planet = {
      url: 'some_prefix/42/'
    };
    component.onSelect(<Planet>planet);
    expect(navigateSpy).toHaveBeenCalledWith(['planets/42']);
  });
});
