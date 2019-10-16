import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { QuizComponent } from './quiz.component';
import { QuizRoutingModule } from './quiz-routing.module';

@NgModule({
  declarations: [
    QuizComponent
  ],
  imports: [
    QuizRoutingModule,
    SharedModule
  ]
})
export class QuizModule { }
