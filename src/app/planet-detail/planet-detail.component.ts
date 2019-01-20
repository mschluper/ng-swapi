import { Component, OnInit } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { ActivatedRoute } from '@angular/router';
import { Planet } from '../DTOs/planet';
import { FormControl, Validators } from '@angular/forms';
import { MessageService, MessageType } from '../services/message.service';
import { CachedSwapiService } from '../services/cached-swapi.service';

@Component({
  selector: 'app-planet-detail',
  templateUrl: './planet-detail.component.html',
  styleUrls: ['./planet-detail.component.scss']
})
export class PlanetDetailComponent implements OnInit {
  planet: Planet;
  readOnly: boolean = true;
  percentages = [];
  nameFormControl = new FormControl('', [
    Validators.required
  ]);
  planetId: number = -1;

  constructor(private route: ActivatedRoute,
              private swapiService: CachedSwapiService,
              private messageService: MessageService) {}

  ngOnInit(): void {
    this.getPlanet();
    for (let i = 0; i <= 100; i++) {
      this.percentages.push({value: `${i}`, viewValue: `${i}`})
    }
  }

  enableEdit(): void {
    this.readOnly = false;
  }
 
  getPlanet(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (!id) {
      // It's a new planet to be created
      this.readOnly = false;
      this.planet = new Planet();
      this.planet.id = this.planetId--;
      return;
    }
    this.swapiService.getPlanetById(id)
    .subscribe(p => {
      this.planet = p;
    })
  }

  saveThePlanet(): void {
    if (!this.planet.name || !this.planet.name.length) {
      // This should never happen - the UI should catch this.
      this.messageService.add(MessageType.error, 'A planet name is required.')
      return;
    }
    this.swapiService.savePlanet(this.planet)
    .subscribe(nr => {
      console.log(`Thank God. Planet ${nr} has been saved.`);
    })
  }
}
