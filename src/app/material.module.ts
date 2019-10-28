import { NgModule } from '@angular/core';

import {
  MatCardModule,
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  MatRadioModule
} from '@angular/material';

@NgModule({
  imports: [
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule
  ],
  exports: [
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule
  ]
})
export class MaterialModule {}
