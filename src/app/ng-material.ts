import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule, MatIconModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  imports: [MatSidenavModule, MatIconModule, MatButtonToggleModule,
    MatTableModule,
    MatButtonModule, MatCheckboxModule],
  exports: [MatSidenavModule, MatIconModule, MatButtonToggleModule,
    MatTableModule,
    MatButtonModule, MatCheckboxModule],
})
export class NgMaterialModule { }