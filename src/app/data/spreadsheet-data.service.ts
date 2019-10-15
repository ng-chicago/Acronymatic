import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';

import { SpreadsheetIDs } from './spreadsheetIDs';

@Injectable()
export class SpreadsheetDS {

  ssIDs: SpreadsheetIDs = new SpreadsheetIDs;
  lastUpdated = new Date();
  refreshHowOften = (36e5 * 6); // 6 hours

  acronymSets$: Observable<Array<any>>;
  compTIASecurityPlus$: Observable<Array<any>>;

  acronymSetsLabel = 'Acronym Sets';
  compTIASecurityPlusLabel = 'CompTIA Security Plus';

  acronymSetsUpdated = new EventEmitter<Array<any>>();
  compTIASecurityPlusUpdated = new EventEmitter<Array<any>>();

  constructor(public http: HttpClient) {

    // initial loads
    this.loadAcronymSets('AcronymSets');
    this.loadCompTIASecurityPlus('CompTIASecurityPlus');

    // setInterval( () => { this.refreshStaleData(); }, this.refreshHowOften);
  }

  public static setLocal(whatData: any, cacheName: string) {
    // writes data to local storage
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  refreshStaleData() {
    this.refreshAll();
  }

  // google sheets
  getHTTPData_SS(whatTab: string): Observable<Array<any>> {
    console.log('Getting data from the ' + whatTab + ' spreadsheet tab');
    return this.http.get<any>(this.ssIDs.getTabURL(whatTab))
      .pipe(map(obj => obj.feed.entry));
  }

  getHTTPData_Tabs(): Observable<Array<any>> {
    console.log('Getting all tabs in the spreadsheet');
    return this.http.get<any>(this.ssIDs.getAllTabsURL())
      .pipe(map(obj => obj.feed.entry));
  }

  refreshAll() {
    this.loadAcronymSets('AcronymSets');
    this.loadCompTIASecurityPlus('CompTIASecurityPlus');
    this.lastUpdated = new Date();
  }

  loadAcronymSets(objName: string) {
    let setCount = 0;
    let acronymSets: Array<any> = [];
    this.acronymSets$ = this.getHTTPData_SS(objName);
    this.acronymSets$.subscribe(next => {
      if (next != null) {
        // transform the JSON returned to make it more usable
        acronymSets = this.transformAcronymSets(next);
        setCount = acronymSets.length;
      }
      SpreadsheetDS.setLocal(acronymSets, this.ssIDs.getCacheName(objName));
      this.acronymSetsLabel = this.buildLabel(setCount, objName);
      this.acronymSetsUpdated.emit(acronymSets);
    });

  }

  transformAcronymSets(dataReceived: Array<any>): Array<any> {
    const tempArray: Array<any> = [];
    for (const i of dataReceived) {
      tempArray.push({
        TabID: i.gsx$tabid.$t,
        SetName: i.gsx$setname.$t,
        Count: i.gsx$count.$t
      });
    }
    return tempArray;
  }

  loadCompTIASecurityPlus(objName: string) {
    let count = 0;
    let compTIASecurityPlus: Array<any> = [];
    this.compTIASecurityPlus$ = this.getHTTPData_SS(objName);
    this.compTIASecurityPlus$.subscribe(next => {
      if (next != null) {
        // transform the JSON returned to make it more usable
        compTIASecurityPlus = this.transformLoadCompTIASecurityPlus(next);
        count = compTIASecurityPlus.length;
      }
      SpreadsheetDS.setLocal(compTIASecurityPlus, this.ssIDs.getCacheName(objName));
      this.compTIASecurityPlusLabel = this.buildLabel(count, objName);
      this.compTIASecurityPlusUpdated.emit(compTIASecurityPlus);
    });
  }

  transformLoadCompTIASecurityPlus(dataReceived: Array<any>): Array<any> {
    const tempArray: Array<any> = [];
    for (const i of dataReceived) {
      tempArray.push({
        Acronym: i.gsx$acronym.$t,
        SpelledOut: i.gsx$spelledout.$t,
        MoreURL: i.gsx$moreurl.$t
      });
    }
    return tempArray;
  }

  buildLabel(animalCount: number, objName: string) {
    let label = '';
    const animalName = this.ssIDs.getLabelName(objName);
    switch (animalCount) {
      case 0: {
        label = 'No ' + animalName + 's';
        break;
      }
      case 1: {
        label = '1 ' + animalName;
        break;
      }
      default: {
        label = animalCount + ' ' + animalName + 's';
        break;
      }
    }
    return label;
  }

}
