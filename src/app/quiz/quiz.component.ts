import { Component, OnInit } from '@angular/core';


import { Option, Acronym, Quiz, QuizConfig } from '../models/index';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  cName = 'QuizComponent';

  quizes: any[];
  quizObjName: string;
  quizX: Quiz = new Quiz(null);
  quiz: Array<any>;
  mode = 'quiz';

  // TODO: get these values from saved settings in local storage in init?
  // sds getQuizConfig
  config: QuizConfig = {
    allowBack: true,
    allowReview: true,
    autoMove: false,  // if true, it will move to next question automatically when answered.
    duration: 50000,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    pageSize: 1,
    requiredAll: false,  // indicates if you must answer all the questions before submitting.
    richText: false,
    shuffleAcronyms: false,
    shuffleOptions: false,
    showClock: false,
    showPager: true,
    theme: 'none'
  };
  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  elapsedTime = '00:00';
  duration = '';

  constructor(private sds: SpreadsheetDS) { }

  ngOnInit() {
    console.log(this.cName + '.ngOnInit');
    this.quizes = this.sds.getAllAcronymSets();
    this.quizObjName = this.quizes[0].objName;  // start with the first as the default
    this.loadQuiz(this.quizObjName, 10, 4);
  }

  loadQuiz(quizObjName: string,
           howManyQuestions: number,
           howManyOptions: number) {

    this.quiz = this.sds.buildQuiz(quizObjName, howManyQuestions, howManyOptions);

    // let oneAcronym = new Acronym(null);

    // oneAcronym.name = 'hgfhgf';
    // console.log(oneAcronym);


  // console.log(this.sds.getRandomArrayItems(JSON.parse(localStorage[quizObjName]), howMany));

/*
{
            "id": 1019,
            "name": "Which of the following object is ideal for keeping data alive for a single request?",
            "questionTypeId": 1,
            "options": [
                {
                    "id": 1055,
                    "questionId": 1010,
                    "name": "HttpContext",
                    "isAnswer": true
                },
                {
                    "id": 1056,
                    "questionId": 1010,
                    "name": "Session",
                    "isAnswer": false
                },
                {
                    "id": 1057,
                    "questionId": 1010,
                    "name": "Cookies",
                    "isAnswer": false
                },
                {
                    "id": 1058,
                    "questionId": 1010,
                    "name": "SqlServer",
                    "isAnswer": false
                }
            ],
            "questionType": {
                "id": 1,
                "name": "Multiple Choice",
                "isActive": true
            }
        }

*/




    // this.quiz = new Quiz(res);

    // this.quizService.get(quizName).subscribe(res => {
    //  this.quiz = new Quiz(res);
      // this.pager.count = this.quiz.questions.length;
      // this.startTime = new Date();
      // this.ellapsedTime = '00:00';
      // this.timer = setInterval(() => { this.tick(); }, 1000);
      // this.duration = this.parseTime(this.config.duration);
    // });
    this.mode = 'quiz';
  }



}
