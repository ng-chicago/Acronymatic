import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { SpreadsheetIDs } from './spreadsheetIDs';

import { Option, Acronym, Quiz, QuizConfig } from '../models/index';

@Injectable()
export class SpreadsheetDS {

  cName = 'SpreadsheetDS';

  ssIDs: SpreadsheetIDs = new SpreadsheetIDs();
  lastUpdated = new Date();
  // refreshHowOften = (36e5 * 6); // 6 hours

  objectMetaData$: Observable<Array<any>>;
  // oneTab$: Observable<Array<any>>;

  SY0501Acronyms = 'SY0501Acronyms';
  TechWords = 'TechWords';
  CrazyWords = 'CrazyWords';
  InsuranceAcronyms = 'InsuranceAcronyms';

  SY0501Acronyms$: Observable<Array<any>>;
  TechWords$: Observable<Array<any>>;
  CrazyWords$: Observable<Array<any>>;
  InsuranceAcronyms$: Observable<Array<any>>;

  SY0501AcronymsUpdated = new EventEmitter<Array<any>>();
  TechWordsUpdated = new EventEmitter<Array<any>>();
  CrazyWordsUpdated = new EventEmitter<Array<any>>();
  InsuranceAcronymsUpdated = new EventEmitter<Array<any>>();

  allTabsLoaded = new EventEmitter<boolean>();


  constructor(public http: HttpClient) {
    // console.log(this.cName + '.constructor initial load');
    this.loadFreshData();
  }

  public static setLocal(whatData: any, cacheName: string) {
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  public static getLocal(cacheName: string): Array<any> {
    return JSON.parse(localStorage[cacheName]);
  }

  loadFreshData() {
    // console.log(this.cName + '.loadFreshData');
    this.loadSY0501Acronyms();
    this.loadInsuranceAcronyms();
    this.loadTechWords();
    this.loadCrazyWords();
  }

  loadSY0501Acronyms() {
    // console.log(this.cName + '.loadSY0501Acronyms');
    const whichObject = this.SY0501Acronyms;
    const oneTabLocal: Array<any> = [];
    this.SY0501Acronyms$ = this.getHTTPData_SS(this.ssIDs.getTabID(whichObject));
    this.SY0501Acronyms$.subscribe(next => {
      if (next != null) {
        for (const i of next) {
          oneTabLocal.push({
            Acronym: i.gsx$acronym.$t,
            Index: i.gsx$index.$t,
            SpelledOut: i.gsx$spelledout.$t,
            MoreURL: i.gsx$moreurl.$t
          });
        }
        SpreadsheetDS.setLocal(oneTabLocal, whichObject);
        this.SY0501AcronymsUpdated.emit(oneTabLocal);
        this.buildWordList(oneTabLocal, whichObject);
      }
    });
  }

  loadInsuranceAcronyms() {
    // console.log(this.cName + '.loadInsuranceAcronyms');
    const whichObject = this.InsuranceAcronyms;
    const oneTabLocal: Array<any> = [];
    this.SY0501Acronyms$ = this.getHTTPData_SS(this.ssIDs.getTabID(whichObject));
    this.SY0501Acronyms$.subscribe(next => {
      if (next != null) {
        for (const i of next) {
          oneTabLocal.push({
            Acronym: i.gsx$acronym.$t,
            Index: i.gsx$index.$t,
            SpelledOut: i.gsx$spelledout.$t,
            MoreURL: i.gsx$moreurl.$t
          });
        }
        SpreadsheetDS.setLocal(oneTabLocal, whichObject);
        this.InsuranceAcronymsUpdated.emit(oneTabLocal);
        this.buildWordList(oneTabLocal, whichObject);
      }
    });
  }

  loadTechWords() {
    // console.log(this.cName + '.loadTechWords');
    const whichObject = this.TechWords;
    const oneTabLocal: Array<any> = [];
    this.SY0501Acronyms$ = this.getHTTPData_SS(this.ssIDs.getTabID(whichObject));
    this.SY0501Acronyms$.subscribe(next => {
      if (next != null) {
        for (const i of next) {
          oneTabLocal.push({
            Word: i.gsx$word.$t,
            Description: i.gsx$description.$t
          });
        }
        SpreadsheetDS.setLocal(oneTabLocal, whichObject);
        this.TechWordsUpdated.emit(oneTabLocal);
      }
    });
  }

  loadCrazyWords() {
    // console.log(this.cName + '.loadCrazyWords');
    const whichObject = this.CrazyWords;
    const oneTabLocal: Array<any> = [];
    this.SY0501Acronyms$ = this.getHTTPData_SS(this.ssIDs.getTabID(whichObject));
    this.SY0501Acronyms$.subscribe(next => {
      if (next != null) {
        for (const i of next) {
          oneTabLocal.push({
            Word: i.gsx$word.$t,
            Description: i.gsx$description.$t
          });
        }
        SpreadsheetDS.setLocal(oneTabLocal, whichObject);
        this.CrazyWordsUpdated.emit(oneTabLocal);
      }
    });
  }

  getHTTPData_SS(whatTab: string): Observable<Array<any>> {
    // console.log(this.cName + ' Getting data from the ' + whatTab + ' spreadsheet tab');
    return this.http.get<any>(this.ssIDs.buildTabURL(whatTab))
      .pipe(map(obj => obj.feed.entry));
  }

  buildWordList(dataReceived: Array<any>, whichObject: string) {

    const tempWordsList: Array<any> = [];
    // extract all words
    for (const i of dataReceived) {
      const words = i.SpelledOut.trim().split(' ');

      for (let j = 0; j < words.length; j += 1) {
        tempWordsList.push(words[j].replace(/[^A-Za-z0-9\s]/g, '').replace(/\s{2,}/g, ' '));
      }
    }
    // extract unique words
    // this.uniqueWords = Array.from(new Set(tempWordsList));

    // save it in the local cache
    SpreadsheetDS.setLocal(Array.from(new Set(tempWordsList)).sort(), whichObject + '_Words');

    // console.log('All Words:' + tempWordsList.length);
    // console.log('Unique Words:' + this.uniqueWords.length);
    // this.wordThatStartsWith('A');
    // this.wordThatStartsWith('b');
    // this.wordThatStartsWith('c');
    // this.wordThatStartsWith('d');
    // this.wordThatStartsWith('e');
    // TODO: Add extra words for letters where there are few?
  }

  buildQuizArray(whichItem: string) {
    console.log(this.cName + '.buildQuizArray');
    /*
    Get 10 random acronyms from cached answers ('CompTIASecurityPlusCache')

    // TODO: Exclude items learnt from list to extract before building list
    Loop through all 10
      Add onto each 3 fake answers
      Using each letter to look up list

    */
    // const whichItem = 'SY0501Acronyms';

    console.log(this.getRandomArrayItems(JSON.parse(localStorage[whichItem]), 10));
  }
  getRandomArrayItems(arr: Array<any>, n: number) {
    console.log(this.cName + '.getRandomArrayItems');
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

  getAllAcronymSets() {
    // TODO: get these values from spreadsheetIDs.sheetTabs where DataType === AcronymSet
    return [
      { objName: 'SY0501Acronyms', name: 'CompTIA Security+ (SY0-501) Acronyms' },
      { objName: 'InsuranceAcronyms', name: 'Insurance Acronyms' }
    ];
  }


  buildQuiz(quizObjName: string,
            howManyQuestions: number,
            howManyOptions: number): Array<Quiz> {

    // Quiz - Acronymms = Options

    console.log(this.cName + '.buildQuiz quizObjName:' + quizObjName + ' howManyQuestions:' + howManyQuestions);

    const quizX: Array<Quiz> = [];

    const quiz: Array<Quiz> = [];
    const option: Array<Option> = [];
    const acronym: Array<Acronym> = [];
    let acronyms: Array<any> = [];
    const quizConfig = this.getQuizConfig();
    const uniqueWords = SpreadsheetDS.getLocal(quizObjName + '_Words');
    // const startsWithN = uniqueWords.filter((word) => word.startsWith('N'));

    let randomArray: Array<any>;
    let optionsArray: Array<any>;
    randomArray = this.getRandomArrayItems(JSON.parse(localStorage[quizObjName]), howManyQuestions);

    // for (const i of randomArray) {
    //   optionsArray = this.buildAcronymsArray(uniqueWords, i.Acronym, i.Index, i.SpelledOut, 4);
    //   acronyms.push(optionsArray);
    // }

    acronyms = this.buildAcronymsArray(randomArray, uniqueWords, howManyOptions);

    quizX.push({id: 1,
                name: 'Quiz Name Here',
                description: 'description here',
                config: quizConfig,
                acronyms});

    console.log(quizX);
    return quizX;

  }

  buildAcronymsArray(randomArray: Array<any>,
                     uniqueWords: Array<any>,
                     howManyOptions: number): Array<any> {

    const tempArray: Array<any> = [];
    let optionsArray: Array<any> = [];
    const acronyms: Array<any> = [];
    // const randomNum = Math.floor(Math.random() * (howManyOptions - 1 + 1) + 1);

    /*
AcronymID: string;
    Acronym: string;
    Index: string;
    MoreURL: string;
    options: Option[];
    answered: boolean;
    */

    // loop through the X random acronyms
    for (const i of randomArray) {
      optionsArray = this.buildOptionsArray(uniqueWords, i.Acronym, i.Index, i.SpelledOut, howManyOptions);
      acronyms.push({
        acronymID: i.Acronym + i.Index,
        acronym: i.Acronym,
        moreURL: i.MoreURL,
        options: optionsArray,
        answered: false
      });
    }

    // console.log(tempArray);
    return acronyms;
  }

  buildOptionsArray(uniqueWords: Array<any>,
                    acronym: string,
                    index: string,
                    spelledOut: string,
                    howMany: number): Array<any> {

    const tempArray: Array<any> = [];
    const randomNum = Math.floor(Math.random() * (howMany - 1 + 1) + 1);
    const acronymID = acronym + index;

    for (let i = 1; i < howMany + 1; i++) {
      if (i === randomNum) {
        tempArray.push({ id: i, acronymID, index, spelledOut, isAnswer: true });
      } else {
        tempArray.push({ id: i, acronymID, index, spelledOut: this.buildFakeAnswer(uniqueWords, acronym), isAnswer: false });
      }
    }
    //console.log(tempArray);
    return tempArray;
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
    const startsWith = uniqueWords.filter((word) => word.startsWith(whichLetter));
    const theWord = startsWith[Math.floor(Math.random() * startsWith.length)];
    return theWord;
  }

  getQuizConfig(): QuizConfig {

    // TODO: get these values from saved settings in local storage in init?
    // sds getQuizConfig

    const config: QuizConfig = {
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
    return config;
  }

}
