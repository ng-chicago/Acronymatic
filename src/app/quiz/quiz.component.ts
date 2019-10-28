import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Acronym, Quiz, QuizConfig, Option, WordList } from '../models/index';
import { SpreadsheetDS } from '../data/spreadsheet-data.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {

  cName = 'QuizComponent';

  private SY0501Sub: Subscription;
  optionChosen: Array<any>;
  acronymCount = 10;
  optionsCount = 4;

  quizObjName: string;
  quizName: string;
  extraWords1: string;
  mode = 'quiz';
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  quizX: Array<any>;
  config: QuizConfig = new QuizConfig(null);

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
    // console.log(this.cName + '.ngOnInit');

    this.quizes = this.getAllAcronymSets();
    // start with the first (SY0501) as the default
    this.quizObjName = this.quizes[0].objName;
    this.quizName = this.quizes[0].name;
    this.extraWords1 = this.quizes[0].extraWords1;

    // make sure local storage object is available b4 load
    if (localStorage.hasOwnProperty(this.quizObjName + '_Words')) {
      this.loadQuiz(this.quizName, this.quizObjName, this.acronymCount, this.optionsCount, this.extraWords1);
    }

    this.SY0501Sub = this.sds.SY0501AcronymsWordsUpdated.subscribe(
      () => {
        // console.log(this.cName + '.SY0501AcronymsWordsUpdated');
        this.loadQuiz(this.quizName, this.quizObjName, this.acronymCount, this.optionsCount, this.extraWords1);
      }
    );
  }

  changeQuiz() {
    const whichQuiz = this.quizes.find(obj => obj.objName === this.quizObjName);
    this.loadQuiz(whichQuiz.name, whichQuiz.objName, this.acronymCount, this.optionsCount, whichQuiz.extraWords1);
    this.mode = 'quiz';
    this.quizName = whichQuiz.name;
  }

  quizAgain() {
    this.loadQuiz(this.quizName, this.quizObjName, this.acronymCount, this.optionsCount, this.extraWords1);
    this.mode = 'quiz';
    window.scrollTo(0, 0);
  }

  loadQuiz(quizName: string,
           quizObjName: string,
           howManyAcronyms: number,
           howManyOptions: number,
           extraWords1: string) {

    this.pager.index = 0;
    // console.log(this.cName +
    //   '.loadQuiz  quizName: ' + quizName +
    //   ', quizObjName: ' + quizObjName +
    //   ', howManyAcronyms; ' + howManyAcronyms +
    //   ', howManyOptions: ' + howManyOptions +
    //   ', extraWords1: ' + extraWords1);

    this.optionChosen = new Array();
    this.buildQuiz(quizName, quizObjName, howManyAcronyms, howManyOptions, extraWords1);

    this.config = new QuizConfig(this.quiz.config);
    this.pager.count = this.quiz.acronyms.length;
    // this.quizService.get(quizName).subscribe(res => {
    //  this.quiz = new Quiz(res);
      // this.pager.count = this.quiz.acronyms.length;
      // this.startTime = new Date();
      // this.elapsedTime = '00:00';
      // this.timer = setInterval(() => { this.tick(); }, 1000);
      // this.duration = this.parseTime(this.config.duration);
    // });
    this.mode = 'quiz';
  }

  buildQuiz(quizName: string,
            quizObjName: string,
            howManyAcronyms: number,
            howManyOptions: number,
            extraWords1: string) {

    // console.log(this.cName + '.buildQuiz ' +
    //   'quizName: ' + quizName +
    //   ', quizObjName: ' + quizObjName +
    //   ', howManyAcronyms:' + howManyAcronyms +
    //   ', howManyOptions; ' + howManyOptions +
    //   ', extraWords1: ' + extraWords1);

    let acronymsArray: Array<Acronym> = [];
    const quizConfig = this.getQuizConfig();

    let uniqueWords = SpreadsheetDS.getLocal(quizObjName + '_Words');
    if (extraWords1 !== '') {
      uniqueWords = this.addExtraWords(uniqueWords, extraWords1);
    }

    let randomArray: Array<any>;
    // let optionsArray: Array<any>;
    randomArray = this.getRandomArrayItems(JSON.parse(localStorage[quizObjName]), howManyAcronyms);
    acronymsArray = this.buildAcronymsArray(randomArray, uniqueWords, howManyOptions);

    // TODO Fix this so I don't need to get [0]
    const aQuiz: Array<Quiz> = [{
      id: 1,
      name: quizName,
      description: '',
      config: quizConfig,
      acronyms: acronymsArray
    }];
    this.quiz = new Quiz(aQuiz[0]);
  }

  buildAcronymsArray(randomArray: Array<any>,
                     uniqueWords: Array<any>,
                     howManyOptions: number): Array<Acronym> {

    // console.log(this.cName + '.buildAcronymsArray ' +
    //   ', howManyOptions: ' + howManyOptions);
    // console.log('randomArray: ' + randomArray);
    let optionsArray: Array<Option> = [];
    const acronyms: Array<any> = [];

    // loop through the X random acronyms
    for (const i of randomArray) {
      optionsArray = this.buildOptionsArray(uniqueWords, i.Acronym, i.Index, i.SpelledOut, howManyOptions);
      // console.log('optionsArray');
      // console.log(optionsArray);
      acronyms.push({
        acronymID: i.Acronym + i.Index,
        acronym: i.Acronym,
        index: i.Index,
        moreURL: i.MoreURL,
        options: optionsArray,
        answered: false,
        acronymType: { id: 1, name: 'Multiple Choice', isActive: true },
        acronymTypeId: 1
      });
    }
    return acronyms;
  }

  buildOptionsArray(uniqueWords: Array<any>,
                    acronym: string,
                    index: string,
                    spelledOut: string,
                    howMany: number): Array<Option> {

    // console.log(this.cName + '.buildOptionsArray ' +
    //   ', acronym: ' + acronym +
    //   ', index: ' + index +
    //   ', spelledOut: ' + spelledOut +
    //   ', howMany: ' + howMany);
    // console.log('uniqueWords: ' + uniqueWords);
    const optionsArray: Array<Option> = [];
    const randomNum = Math.floor(Math.random() * (howMany - 1 + 1) + 1);
    const acronymID = acronym + index;

    for (let i = 1; i < howMany + 1; i++) {
      if (i === randomNum) {
        optionsArray.push({ id: i, acronymID, spelledOut, isAnswer: true });
      } else {
        optionsArray.push({ id: i, acronymID, spelledOut: this.buildFakeAnswer(uniqueWords, acronym), isAnswer: false });
      }
    }
    return optionsArray;
  }

  addExtraWords(existingList: Array<any>, extraWords: string): Array<any> {

    const whichObject = 'UniqueQuizWords';
    let extraWordList: Array<WordList> = [];
    let newWordList: Array<any> = [];

    // add passed in  words
    for (const i of existingList) {
      newWordList.push(i);
    }
    // add extra in  words
    extraWordList = SpreadsheetDS.getLocal(extraWords);
    if (extraWordList.length > 0) {
      for (const i of extraWordList) {
        newWordList.push(i.word);
      }
    }
    // make the list unique
    newWordList = Array.from(new Set(newWordList)).sort();
    SpreadsheetDS.setLocal(newWordList, whichObject);

    return newWordList;
  }

  buildFakeAnswer(uniqueWords: Array<any>,
                  acronym: string): string {

    const pattern = /[A-Za-z]|[0-9]+/g;
    let fakeAnswer = '';
    const myArray = acronym.match(pattern);
    for (let i = 0, len = myArray.length; i < len; i++) {
      fakeAnswer = fakeAnswer + this.wordThatStartsWith(uniqueWords, myArray[i]) + ' ';
    }
    return fakeAnswer.trim();
  }

  wordThatStartsWith(uniqueWords: Array<any>,
                     whichLetter: string): string {

    const letter1 = 'X';
    const letter2 = '3';
    const specialWord1 = 'eXtended';
    const specialWord2 = 'Exchange';
    const specialWord3 = 'Triple';
    const specialWord4 = 'Three';

    // letter hard coded random exceptions
    if (whichLetter === letter1) {
      if ((Math.random() >= 0.5) && (uniqueWords.includes(specialWord1))) {
        return specialWord1;
      }
      if ((Math.random() >= 0.5) && (uniqueWords.includes(specialWord2))) {
        return specialWord2;
      }
    }
    if (whichLetter === letter2) {
      if ((Math.random() >= 0.5) && (uniqueWords.includes(specialWord3))) {
        return specialWord3;
      } else {
        return specialWord4;
      }
    }
    // made it to here - do regular lookup
    const startsWith = uniqueWords.filter((word) => word.startsWith(whichLetter));

    // TODO check here for startsWith === undefined
    return startsWith[Math.floor(Math.random() * startsWith.length)];

  }

  get filteredAcronyms() {
    // console.log(this.quiz.acronyms.slice(this.pager.index, this.pager.index + this.pager.size));
    return (this.quiz.acronyms) ?
      this.quiz.acronyms.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  // onSelect(acronym: Acronym, option: Option) {
  //   console.log(this.cName + '.onSelect');
  //   console.log(acronym);
  //   console.log(option);
  //   if (acronym.acronymTypeId === 1) {
  //     acronym.options.forEach(
  //       (x) => {
  //         if (x.id !== option.id) {
  //           x.selected = false;
  //         }
  //       });
  //   }
  //   if (this.config.autoMove) {
  //     this.goTo(this.pager.index + 1);
  //   }
  // }

  onSelect2(acronym: Acronym, selectedIndex: number) {
    // console.log(this.cName + '.onSelect2: ');
    // console.log(acronym);
    // console.log('selectedIndex: ' + selectedIndex);
    // console.log(this.optionChosen);
    acronym.answered = true;
    if (acronym.acronymTypeId === 1) {
      acronym.options.forEach(
        (x) => {
          if (x.id !== this.optionChosen[selectedIndex]) {
            x.selected = false;
          } else {
            x.selected = true;
            acronym.selectedNum = (x.id);
          }
        });
    }
    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }

  }

  onSubmit() {
    const answers = [];
    this.quiz.acronyms.forEach(x => answers.push({ quizId: this.quiz.id, questionId: x.acronymID, answered: x.answered }));
    // Post your data to the server here. answers contains the questionId and the users' answer.
    // console.log(this.quiz.acronyms);
    this.mode = 'result';
  }

  isAnswered(acronym: Acronym) {
    return acronym.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  }

  isCorrect(acronym: Acronym) {
    return acronym.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  }

  ngOnDestroy(): void {
    // console.log(this.cName + '.ngOnDestroy stop listening');
    this.SY0501Sub.unsubscribe();
  }

  getAllAcronymSets() {
    // console.log(this.cName + '.getAllAcronymSets');
    // TODO: get these values from spreadsheetIDs.sheetTabs where DataType === AcronymSet
    return [
      { objName: 'SY0501Acronyms', name: 'CompTIA Security+ (SY0-501) Acronyms', extraWords1: 'TechWords' },
      { objName: 'InsuranceAcronyms', name: 'Insurance Acronyms', extraWords1: '' }
    ];
  }

  getQuizConfig(): QuizConfig {
    // console.log(this.cName + '.getQuizConfig');
    // TODO: get these values from saved settings in local storage in init?
    // sds getQuizConfig
    return {
      allowBack: true,
      allowReview: true,
      autoMove: true,  // if true, it will move to next acronym automatically when answered.
      duration: 50000,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
      pageSize: 1,
      requiredAll: false,  // indicates if you must answer all the acronyms before submitting.
      richText: false,
      shuffleAcronyms: false,
      shuffleOptions: false,
      showClock: false,
      showPager: true,
      theme: 'none'
    };
  }

  getRandomArrayItems(arr: Array<any>, n: number) {
    // console.log(this.cName + '.getRandomArrayItems');
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);
    if (n > len) {
      throw new RangeError('getRandom: more elements taken than available');
    }
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

}
