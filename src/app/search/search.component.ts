import { Component, OnInit, OnDestroy,  ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SpreadsheetDS } from '../data/spreadsheet-data.service';

export interface TheAcronyms {
  Name: string;
  SpelledOut: string;
  MoreURL: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  acronyms: MatTableDataSource<TheAcronyms>;
  objName = 'SY0501Acronyms';
  cName = 'SearchComponent';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // the column order
  displayedColumns: string[] = ['Name', 'SpelledOut'];

  constructor(public sds: SpreadsheetDS) {
    // console.log(this.cName + '.constructor');
    this.sds.SY0501AcronymsUpdated.subscribe(
      (newData: any) => {
        this.acronyms = new MatTableDataSource(newData);
        this.acronyms.paginator = this.paginator;
        this.acronyms.sort = this.sort;

        this.acronyms.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'Name': return new Date(item.Name);
            default: return item[property];
          }
        };
      }
    );
  }

  ngOnInit() {
    // console.log(this.cName + '.ngOnInit');
    this.sds.SY0501AcronymsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.objName] || '[]')
   );
    this.acronyms.paginator = this.paginator;
  }
  ngOnDestroy(): void {
    // console.log(this.cName + '.ngOnDestroy stop listening');
  }

  applyFilter(filterValue: string) {
    this.acronyms.filter = filterValue.trim().toLowerCase();
    if (this.acronyms.paginator) {
      this.acronyms.paginator.firstPage();
    }
  }



}
