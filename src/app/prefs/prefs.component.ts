import { Component, OnInit } from '@angular/core';
import { UserPrefsService } from '../data/user-prefs.service';

@Component({
  selector: 'app-prefs',
  templateUrl: './prefs.component.html',
  styleUrls: ['./prefs.component.css']
})
export class PrefsComponent implements OnInit {

  constructor(public ups: UserPrefsService) {}

  ngOnInit() {}

  setKnownAcronyms(newVal: boolean) {

  }

}
