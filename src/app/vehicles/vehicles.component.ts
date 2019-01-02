import { Component, OnInit } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { Vehicle } from '../DTOs/vehicle';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  sortedVehicles: Vehicle[];

  constructor(private swapiService: SwapiService) { }

  ngOnInit() {
    this.getAllVehicles();
  }

  getAllVehicles() {
    let vehicleSort = (x: Vehicle, y: Vehicle) => x.name < y.name ? -1 : 1;

    this.sortedVehicles = [];
    this.swapiService.getAllThings<Vehicle>('vehicles')
    .subscribe(vehicle => {
      this.sortedVehicles.push(<Vehicle>vehicle);
      this.sortedVehicles.sort(vehicleSort);
    });
  }

}
