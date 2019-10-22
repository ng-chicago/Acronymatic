import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { KnownAcronymsComponent } from './prefs/knownAcronyms/knownAcronyms.component';

@NgModule({
  declarations: [
    KnownAcronymsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    KnownAcronymsComponent
  ]
})
export class SharedModule { }
