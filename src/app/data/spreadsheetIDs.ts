export class SpreadsheetIDs {

  public static spreadsheetID = '1Q5nYcaWYc9pBo44_HzrN8V7MBmkHr5LYqr4x53dLV5M';
  public static metaDataTabID = 'od6';
  public static objectMetaData = [];

  tabURLStart = 'https://spreadsheets.google.com/feeds/list/';
  allTabsURLStart = 'https://spreadsheets.google.com/feeds/worksheets/';
  urlEnd = '/public/full?alt=json';

  buildTabURL(whichTab: string): string {
    return this.tabURLStart + SpreadsheetIDs.spreadsheetID + '/' +
      whichTab + this.urlEnd;
  }
  // getTabID(whichTab: string ): string {
  //   return SpreadsheetIDs.objectMetaData.find(myObj => myObj.objName === whichTab).TabID;
  // }
  // getDataType(whichTab: string ): string {
  //   return SpreadsheetIDs.objectMetaData.find(myObj => myObj.objName === whichTab).DataType;
  // }
  // getSetName(whichTab: string): string {
  //   return SpreadsheetIDs.objectMetaData.find(myObj => myObj.objName === whichTab).SetName;
  // }
  // getObjectName(whichTab: string): string {
  //   return SpreadsheetIDs.objectMetaData.find(myObj => myObj.objName === whichTab).ObjectName;
  // }
  // getCount(whichTab: string): string {
  //   return SpreadsheetIDs.objectMetaData.find(myObj => myObj.objName === whichTab).Count;
  // }

  // getCacheName(): string {
  //   return this.allTabsURLStart + SpreadsheetIDs.spreadsheetID + this.urlEnd;
  // }


}
