import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { SpreadsheetIDs } from './spreadsheetIDs';

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

  uniqueWords: Array<any> = [];


  constructor(public http: HttpClient) {
    // initial load
    console.log(this.cName + '.constructor');
    this.loadFreshData();
  }

  public static setLocal(whatData: any, cacheName: string) {

    localStorage[cacheName] = JSON.stringify(whatData);
  }

  public static getLocal(cacheName: string): Array<any> {
    return localStorage[cacheName];
  }

  loadFreshData() {
    console.log(this.cName + '.loadFreshData');
    this.loadSY0501Acronyms();
    this.loadInsuranceAcronyms();
    this.loadTechWords();
  }

  loadSY0501Acronyms() {
    const whichObject = this.SY0501Acronyms;
    console.log('Loading ' + whichObject);
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
      }
    });
  }

  loadInsuranceAcronyms() {
    const whichObject = this.InsuranceAcronyms;
    console.log('Loading ' + whichObject);
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
      }
    });
  }

  loadTechWords() {
    const whichObject = this.TechWords;
    console.log('Loading ' + whichObject);
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
    const whichObject = this.CrazyWords;
    console.log('Loading ' + whichObject);
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

  loadDataTabs() {
    for (const i of SpreadsheetIDs.objectMetaData) {
      if (i.DataType !== 'None') {
        console.log('Loading ' + i.ObjectName);
        // this.loadOneTab(i.TabID, i.DataType, i.ObjectName);
      }
    }
    this.lastUpdated = new Date();
  }

  getHTTPData_SS(whatTab: string): Observable<Array<any>> {
    // console.log('Getting data from the ' + whatTab + ' spreadsheet tab');
    return this.http.get<any>(this.ssIDs.buildTabURL(whatTab))
      .pipe(map(obj => obj.feed.entry));
  }

  buildWordList(dataReceived: Array<any>) {

    const tempWordsList: Array<any> = [];
    // extract all words
    for (const i of dataReceived) {
      const words = i.gsx$spelledout.$t.trim().split(' ');
      for (let j = 0; j < words.length; j += 1) {
        tempWordsList.push(words[j]);
      }
    }
    // extract unique words
    this.uniqueWords = Array.from(new Set(tempWordsList));

    // save it in the local cache
    SpreadsheetDS.setLocal(this.uniqueWords.sort(), 'UniqueWordsCache');

    // console.log('All Words:' + tempWordsList.length);
    // console.log('Unique Words:' + this.uniqueWords.length);
    // this.wordThatStartsWith('A');
    // this.wordThatStartsWith('b');
    // this.wordThatStartsWith('c');
    // this.wordThatStartsWith('d');
    // this.wordThatStartsWith('e');
    // TODO: Add extra words for letters where there are few?
  }
  wordThatStartsWith(whichLetter: string) {
    const startsWith = this.uniqueWords.filter((word) => word.toLowerCase().startsWith(whichLetter.toLowerCase()));
    // const startsWith = this.uniqueWords.filter((whichLetter) => whichLetter.toLowerCase().startsWith(e.target.value.toLowerCase())
    // console.log(startsWith);
    console.log(startsWith[Math.floor(Math.random() * startsWith.length)]);
  }
  buildQuizArray(whichItem: string) {
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
