import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetDetailComponent } from './planet-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { SwapiService } from '../services/swapi.service';
import { MockSwapiService } from '../mockServices/swapi.service.mock';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgMaterialModule } from '../ng-material';
import { MessageService } from '../services/message.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PlanetDetailComponent', () => {
  let component: PlanetDetailComponent;
  let fixture: ComponentFixture<PlanetDetailComponent>;

  const fakeActivatedRoute = {
    snapshot: { 
      paramMap: { get : (name) => 'SomeId' } 
    }
  } as ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        NgMaterialModule
      ],
      providers: [
        MessageService,
        {
          provide: SwapiService,
          useClass: MockSwapiService
        }, {
          provide: ActivatedRoute, 
          useValue: fakeActivatedRoute
        }
      ],
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
