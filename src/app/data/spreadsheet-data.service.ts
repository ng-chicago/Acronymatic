import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { SpreadsheetIDs } from './spreadsheetIDs';

@Injectable()
export class SpreadsheetDS {

  ssIDs: SpreadsheetIDs = new SpreadsheetIDs;
  lastUpdated = new Date();
  // refreshHowOften = (36e5 * 6); // 6 hours

  objectMetaData$: Observable<Array<any>>;
  oneTab$: Observable<Array<any>>;
  compTIASecurityPlusUpdated = new EventEmitter<Array<any>>();
  uniqueWords: Array<any> = [];

  constructor(public http: HttpClient) {
    // initial load
    this.loadFreshData();
  }

  public static setLocal(whatData: any, cacheName: string) {
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  public static getLocal(cacheName: string): Array<any> {
    return localStorage[cacheName];
  }

  loadFreshData() {
    console.log('Loading MetaDataTab');
    this.objectMetaData$ = this.getHTTPData_SS(SpreadsheetIDs.metaDataTabID);
    this.objectMetaData$.subscribe(next => {
      if (next != null) {
        for (const i of next) {
          SpreadsheetIDs.objectMetaData.push({
            TabID: i.gsx$tabid.$t,
            DataType: i.gsx$datatype.$t,
            SetName: i.gsx$setname.$t,
            ObjectName: i.gsx$objectname.$t,
            Count: i.gsx$count.$t
          });
        }
        // load into local cache
        SpreadsheetDS.setLocal(SpreadsheetIDs.objectMetaData, 'ObjectMetaData_C');
        this.loadDataTabs();
      }
    });
  }

  loadDataTabs() {
    for (const i of SpreadsheetIDs.objectMetaData) {
      if (i.DataType !== 'None') {
        console.log('Loading ' + i.ObjectName);
        this.loadOneTab(i.TabID, i.DataType, i.ObjectName);
      }
    }
    this.lastUpdated = new Date();
  }

  loadOneTab(tabID: string, dataType: string, objectName: string) {
    const oneTabLocal: Array<any> = [];
    this.oneTab$ = this.getHTTPData_SS(tabID);
    this.oneTab$.subscribe(next => {
      if (next != null) {
        for (const i of next) {
          if (dataType === 'AcronymSet') {
            oneTabLocal.push({
              Acronym: i.gsx$acronym.$t,
              SpelledOut: i.gsx$spelledout.$t,
              MoreURL: i.gsx$moreurl.$t
            });
          } else if (dataType === 'AdditionalWords') {
            oneTabLocal.push({
              Word: i.gsx$word.$t,
              Description: i.gsx$description.$t
            });
          }
        }
        SpreadsheetDS.setLocal(oneTabLocal, objectName + '_C');

        // TODO Hardcode Fix
        if (objectName === 'SY0501Acronyms') {
          this.compTIASecurityPlusUpdated.emit(oneTabLocal);
        }

        // TODO Set dynamic tab data here?

      }
    });
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
    SpreadsheetDS.setLocal(this.uniqueWords.sort(), 'UniqueWordsCache_C');

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
    //const startsWith = this.uniqueWords.filter((whichLetter) => whichLetter.toLowerCase().startsWith(e.target.value.toLowerCase())
    //console.log(startsWith);
    console.log(startsWith[Math.floor(Math.random() * startsWith.length)]);
  }
  buildQuizArray() {
    /*
    Get 10 random acronyms from cached answers ('CompTIASecurityPlusCache')
      Exclude known items list
    Loop through all 10
      Add onto each 3 fake answers
      Using each letter to look up list

    */
    const whichItem = 'CompTIASecurityPlusCache';
    console.log(this.getRandomArrayItems(JSON.parse(localStorage[whichItem]), 10));
  }
  getRandomArrayItems(arr: Array<any>, n: number) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
  }
  buildQuiz() {

  }

}
