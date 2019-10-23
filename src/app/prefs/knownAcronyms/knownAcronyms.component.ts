import { Component, OnDestroy, OnInit  } from '@angular/core';
import { UserPrefsService } from '../../data/user-prefs.service';
import { Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-known-acronyms-pref',
  templateUrl: './knownAcronyms.component.html',
  styleUrls: ['./knownAcronyms.component.css']
})
export class KnownAcronymsComponent implements OnInit, OnDestroy {

  cName = 'KnownAcronymsComponent';
  excludeKnownAcronyms: boolean;
  private KnownAcronymsComponentSub: Subscription;

  constructor(private ups: UserPrefsService) {
    console.log(this.cName + '.constructor');
    this.excludeKnownAcronyms = ups.excludeKnownAcronyms$.getValue();
  }

  ngOnInit() {
    console.log(this.cName + '.ngOnInit start listening');
    this.KnownAcronymsComponentSub = this.ups.excludeKnownAcronyms$.subscribe(
      (newValue: boolean) => {
        this.excludeKnownAcronyms = newValue;
      }
    );
  }

  ngOnDestroy(): void {
    console.log(this.cName + '.ngOnDestroy stop listening');
    this.KnownAcronymsComponentSub.unsubscribe();
  }

  knownAcronymsChanged() {
    this.ups.setExcludeKnownAcronyms(this.excludeKnownAcronyms);
  }

}
