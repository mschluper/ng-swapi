import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMaterialModule } from '../ng-material';
import { NavMenuComponent } from './nav-menu.component';
import { Router } from '@angular/router';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;
  let navigateSpy: jasmine.Spy = jasmine.createSpy("navigate");

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgMaterialModule    // mat-tree needs it
      ],
      providers: [ 
      {
        provide: Router, 
        useClass: class { navigate = navigateSpy; } 
      }],
      declarations: [ NavMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
