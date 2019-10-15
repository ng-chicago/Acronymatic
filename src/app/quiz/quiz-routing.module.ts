import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizComponent } from './quiz.component';

const quizRoutes: Routes = [
  { path: '', component: QuizComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(quizRoutes)
  ],
  exports: [RouterModule]
})
export class QuizRoutingModule {}
