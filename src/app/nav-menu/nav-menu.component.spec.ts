import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMaterialModule } from '../ng-material';
import { NavMenuComponent } from './nav-menu.component';
import { RouterModule } from '@angular/router';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,       // routerLink needs it
        NgMaterialModule    // spinner needs it
      ],
      declarations: [ NavMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
