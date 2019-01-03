import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetDetailComponent } from './planet-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { SwapiService } from '../services/swapi.service';
import { ActivatedRoute } from '@angular/router';

describe('PlanetDetailComponent', () => {
  let component: PlanetDetailComponent;
  let fixture: ComponentFixture<PlanetDetailComponent>;

  const fakeActivatedRoute = {
    snapshot: { 
      //data: { ... } 
      paramMap: { get : (name) => 'SomeId' } 
    }
  } as ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SwapiService, {
        provide: ActivatedRoute, 
        useValue: fakeActivatedRoute
      }],
      declarations: [ PlanetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
