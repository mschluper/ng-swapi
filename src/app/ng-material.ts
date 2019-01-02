import { NgModule } from '@angular/core';
import { MatSidenavModule, MatIconModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  imports: [MatSidenavModule, MatIconModule, MatButtonToggleModule,
    MatButtonModule, MatCheckboxModule],
  exports: [MatSidenavModule, MatIconModule, MatButtonToggleModule,
    MatButtonModule, MatCheckboxModule],
})
export class NgMaterialModule { }