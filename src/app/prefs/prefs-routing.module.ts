import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrefsComponent } from './prefs.component';

const prefsRoutes: Routes = [
  { path: '', component: PrefsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(prefsRoutes)
  ],
  exports: [RouterModule]
})
export class PrefsRoutingModule {}
