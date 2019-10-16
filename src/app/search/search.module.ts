import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    SearchRoutingModule,
    SharedModule
  ]
})
export class SearchModule { }
