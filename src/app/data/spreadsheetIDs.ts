export class SpreadsheetIDs {

  public static spreadsheetID = '1Q5nYcaWYc9pBo44_HzrN8V7MBmkHr5LYqr4x53dLV5M';
  public static metaDataTabID = 'od6';
  public static objectMetaData = [];

  sheetTabs = [
    { ObjectName: 'SY0501Acronyms',  TabID: 'otj0w48', DataType: 'AcronymSet', SetName: 'CompTIA Security+ (SY0-501) Acronyms'},
    { ObjectName: 'TechWords', TabID: 'oy93aqx', DataType: 'AdditionalWords', SetName: 'Technology Words'},
    { ObjectName: 'CrazyWords', TabID: 'oew6e8w', DataType: 'AdditionalWords', SetName: 'Crazy Words' },
    { ObjectName: 'InsuranceAcronyms', TabID: 'o75ro3o', DataType: 'AcronymSet', SetName: 'Insurance Acronyms' }
  ];

  tabURLStart = 'https://spreadsheets.google.com/feeds/list/';
  allTabsURLStart = 'https://spreadsheets.google.com/feeds/worksheets/';
  urlEnd = '/public/full?alt=json';

  buildTabURL(whichTab: string): string {
    return this.tabURLStart + SpreadsheetIDs.spreadsheetID + '/' +
      whichTab + this.urlEnd;
  }

  getTabID(ObjectName: string): string {
    return this.sheetTabs.find(myObj => myObj.ObjectName === ObjectName).TabID;
  }



}
