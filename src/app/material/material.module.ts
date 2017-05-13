import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdButtonModule, MdCardModule, MdIconModule, MdInputModule, MdListModule, MdSidenavModule, MdSnackBarModule,
  MdTabsModule, MdToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MdSidenavModule,
    MdIconModule,
    MdButtonModule,
    MdTabsModule,
    MdListModule,
    MdCardModule,
    MdToolbarModule,
    MdInputModule,
    MdSnackBarModule
  ],
  declarations: []
})
export class MaterialModule { }
