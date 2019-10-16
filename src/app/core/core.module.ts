import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../shared.module';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from '../app-routing.module';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';
import { HeaderComponent } from './nav/header/header.component';
import { SearchComponent } from '../search/search.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    SearchComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent
  ],
  providers: [
    SpreadsheetDS
  ]
})
export class CoreModule { }
