import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { SpreadsheetIDs } from './spreadsheetIDs';

import { Quiz } from '../models/index';


@Injectable({ providedIn: 'root' })
export class SpreadsheetDS {

  cName = 'SpreadsheetDS';

  quizX = new Quiz(null);

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
  SY0501AcronymsWordsUpdated = new EventEmitter<Array<any>>();
  TechWordsUpdated = new EventEmitter<Array<any>>();
  CrazyWordsUpdated = new EventEmitter<Array<any>>();
  InsuranceAcronymsUpdated = new EventEmitter<Array<any>>();
  InsuranceAcronymsWordsUpdated = new EventEmitter<Array<any>>();

  allTabsLoaded = new EventEmitter<boolean>();

  constructor(public http: HttpClient) {
    // console.log(this.cName + '.constructor initial load');
    this.loadFreshData();
  }

  public static setLocal(whatData: any, cacheName: string) {
    // console.log('.setLocal, cacheName: ' + cacheName);
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  public static getLocal(cacheName: string): Array<any> {
    // console.log('.getLocal, cacheName: ' + cacheName);
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
        this.SY0501AcronymsWordsUpdated.emit(oneTabLocal);
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
        this.InsuranceAcronymsWordsUpdated.emit(oneTabLocal);
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
            word: i.gsx$word.$t,
            description: i.gsx$description.$t
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
            word: i.gsx$word.$t,
            description: i.gsx$description.$t
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
    // console.log(this.cName + '.buildWordList whichObject: ' + whichObject );
    const tempWordsList: Array<any> = [];
    let oneWord = '';
    // extract all words
    for (const i of dataReceived) {
      const words = i.SpelledOut.trim().split(' ');

      // TODO fix this error
      for (let j = 0; j < words.length; j += 1) {
      // for (const j of words) {
        // tempWordsList.push(words[j].replace(/[^A-Za-z0-9\s]/g, '').replace(/\s{2,}/g, ' '));
        oneWord = words[j].replace(',', '').trim();
        tempWordsList.push(oneWord);

        // also break apart words with a slash
        if (oneWord.indexOf('/') > -1) {
          const res = oneWord.split('/');
          for (const b of res) {
            tempWordsList.push(b);
          }
        }

      }
    }
    // extract unique words
    // this.uniqueWords = Array.from(new Set(tempWordsList));

    // save the sorted unique list in local cache
    SpreadsheetDS.setLocal(Array.from(new Set(tempWordsList)).sort(), whichObject + '_Words');

    // TODO: Add extra words for letters where there are few?
  }


}
