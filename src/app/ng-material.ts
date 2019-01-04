import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  imports: [MatSidenavModule, MatIconModule, MatButtonToggleModule,
    MatTableModule,
    MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatCardModule],
  exports: [MatSidenavModule, MatIconModule, MatButtonToggleModule,
    MatTableModule,
    MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatCardModule],
})
export class NgMaterialModule { }