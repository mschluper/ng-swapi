import { NgModule } from '@angular/core';
//import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatCardModule, MatTooltipModule, MatTableModule} from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const modules = [
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatTableModule,
  MatTooltipModule
]
@NgModule({
  imports: modules,
  exports: modules,
})
export class NgMaterialModule { }