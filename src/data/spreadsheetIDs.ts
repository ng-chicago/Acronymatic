export class SpreadsheetIDs {

  spreadsheetID = '1Q5nYcaWYc9pBo44_HzrN8V7MBmkHr5LYqr4x53dLV5M';

  dataObjects =  [
    { objName: 'AcronymSets', tabID: 'od6', cache: 'AcronymSetsCache', useYN: 'Y', labelName: 'Acronym Sets'},
    { objName: 'CompTIASecurityPlus', tabID: 'otj0w48', cache: 'CompTIASecurityPlusCache', useYN: 'Y', labelName: 'CompTIA Security Plus'}
  ];
  tabURLStart = 'https://spreadsheets.google.com/feeds/list/';
  allTabsURLStart = 'https://spreadsheets.google.com/feeds/worksheets/';
  urlEnd = '/public/full?alt=json';

  getTabURL(whichTab: string ): string {
    return this.tabURLStart + this.spreadsheetID + '/' +
      this.dataObjects.find(myObj => myObj.objName === whichTab).tabID +
      this.urlEnd;
  }
  getCacheName(whichTab: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichTab).cache;
  }
  getLabelName(whichTab: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichTab).labelName;
  }
  getAllTabsURL(): string {
    return this.allTabsURLStart + this.spreadsheetID + this.urlEnd;
  }
}
