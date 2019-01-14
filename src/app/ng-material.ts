import { NgModule } from '@angular/core';
//import { MatTableModule } from '@angular/material/table';
import { 
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatTooltipModule,
  MatTreeModule
} from '@angular/material';

const modules = [
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatTooltipModule,
  MatTreeModule
]
@NgModule({
  imports: modules,
  exports: modules,
})
export class NgMaterialModule { }