import { Injectable } from '@angular/core';

@Injectable()
export class QuizService {

  constructor() { }

  get(url: string) {
    // get 10 random items

    // return this.http.get(url);
  }

  getAllAcronymSets() {
    // TODO: get these values from spreadsheetIDs.sheetTabs where DataType === AcronymSet
    return [
      { objName: 'SY0501Acronyms', name: 'CompTIA Security+ (SY0-501) Acronyms' },
      { objName: 'InsuranceAcronyms', name: 'Insurance Acronyms' }
    ];
  }

}
