import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';
import { HttpClientModule } from '@angular/common/http';
import { SwapiService } from '../services/swapi.service';
import { MockSwapiService } from '../mockServices/swapi.service.mock';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../ng-material';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,   // HttpClient needs it
        RouterModule,       // routerLink needs it
        NgMaterialModule    // spinner needs it
      ],
      providers: [{
        provide: SwapiService,
        useClass: MockSwapiService
      }],
      declarations: [ PeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});