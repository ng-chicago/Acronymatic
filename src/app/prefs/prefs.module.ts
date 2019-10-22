import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { PrefsComponent } from './prefs.component';
import { PrefsRoutingModule } from './prefs-routing.module';

@NgModule({
  declarations: [
    PrefsComponent
  ],
  imports: [
    PrefsRoutingModule,
    SharedModule
  ]
})
export class PrefsModule { }
