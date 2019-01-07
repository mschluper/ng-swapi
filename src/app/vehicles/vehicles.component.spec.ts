import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesComponent } from './vehicles.component';
import { SwapiService } from '../services/swapi.service';
import { MockSwapiService } from '../mockServices/swapi.service.mock';
import { HttpClientModule } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { Vehicle } from '../DTOs/vehicle';

describe('VehiclesComponent', () => {
  let component: VehiclesComponent;
  let fixture: ComponentFixture<VehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: SwapiService,
        useClass: MockSwapiService
      }],
      declarations: [ VehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let vehicles = [<Vehicle>{ name: 'SUV' }, <Vehicle>{ name: 'Pickup Truck'}];
    const swapiService = jasmine.createSpyObj('SwapiService', ['getAllThings']);
    // Make the spy return a synchronous Observable with the test data
    let getVehiclesSpy = swapiService.getAllThings.and.returnValue( of(vehicles) );

    fixture = TestBed.createComponent(VehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.whenStable().then(r => {
      console.log('sorted vehicles: ', component.sortedVehicles.length)
    })
  });
});
