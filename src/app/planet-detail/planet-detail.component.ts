import { Component, OnInit } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { ActivatedRoute } from '@angular/router';
import { Planet } from '../DTOs/planet';

@Component({
  selector: 'app-planet-detail',
  templateUrl: './planet-detail.component.html',
  styleUrls: ['./planet-detail.component.scss']
})
export class PlanetDetailComponent implements OnInit {
  planet: Planet;

  constructor(private route: ActivatedRoute,
              private swapiService: SwapiService) {}

  ngOnInit(): void {
    this.getPlanet();
  }
 
  getPlanet(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.swapiService.getPlanet(id)
      .subscribe(planet => this.planet = planet);
  }
}
