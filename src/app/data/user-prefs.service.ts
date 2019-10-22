import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserPrefsService {

    excludeKnownAcronyms$ = new BehaviorSubject(true);
    defaultExcludeKnownAcronyms = false;
    lsExcludeKnownAcronyms = 'ExcludeKnownAcronyms';
    cName = 'UserPrefsService';

    constructor() {
        console.log(this.cName + '.constructor');
        this.loadData();
    }

    loadData() {

        // use local strage values if available
        const sValue = localStorage[this.lsExcludeKnownAcronyms] || '';
        if (sValue === '') {
            // console.log('Setting DEFAULT Campus: ' + this.defaultCampus);
            this.setExcludeKnownAcronyms(this.defaultExcludeKnownAcronyms);
            // this.setSubject(this.defaultCampus);
            // this.preferredCampus.next(sValue);
        } else {
            // console.log('Using EXISTING local storage Campus: ' + sValue);
            this.setExcludeKnownAcronyms(sValue);
            // this.setSubject(sValue);
            // this.preferredCampus.next(sValue);
        }
    }

    setExcludeKnownAcronyms(yesOrNo: boolean) {
        localStorage[this.lsExcludeKnownAcronyms] = yesOrNo;
        this.excludeKnownAcronyms$.next(yesOrNo);
    }

    // setSubject(whatCampus: string) {
    //     this.preferredCampus$.next(whatCampus);
    // }

}
