import { Component, OnInit, ViewChild } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { Person } from '../DTOs/person';
import { Planet } from '../DTOs/planet';
import { MatTable } from '@angular/material';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  sortedPeople: Person[] = [];
  dataSource = this.sortedPeople;
  displayedColumns: string[] = ['name', 'mass', 'gender', 'home', 'films'];
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private swapiService: SwapiService) { }

  ngOnInit() {
    this.getAllPeople();
    //this.dataSource.sort = this.sort;
  }

  getAllPeople() {
    let personSort = (x: Person, y: Person) => x.name < y.name ? -1 : 1;

    this.swapiService.getAllThings<Person>('people')
    .subscribe(p => {
      let person = <Person>p;
      let id = this.getPlanetId(person.homeworld);
      person.homeUrl = `/planets/${id}`;
      this.sortedPeople.push(person);
      this.sortedPeople.sort(personSort);
      this.table.renderRows();

      // Since this ia all an experiment, why not retrieve the planets' names?
      this.swapiService.getPlanet(id)
      .subscribe(p => {
        person.homeName = (<Planet>p).name;
      });
    });
  }

  getPlanetId(url) : number {
    let parts = url.split("/");
    if (parts.length < 2) return;
    let id = +parts[parts.length-2];
    return id;
  }
}
