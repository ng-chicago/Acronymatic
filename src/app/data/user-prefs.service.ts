import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserPrefsService {

    cName = 'UserPrefsService';

    excludeKnownAcronyms$ = new BehaviorSubject(true);
    defaultExcludeKnownAcronyms = false;
    lsExcludeKnownAcronyms = 'ExcludeKnownAcronyms';

    timesToLearnt$ = new BehaviorSubject(3);
    defaultTimesToLearnt = 3;
    lsTimesToLearnt = 'ExcludeKnownAcronyms';

    constructor() {
        console.log(this.cName + '.constructor');
        this.loadData();
    }

    loadData() {
        console.log(this.cName + '.loadData');
        // use local storage values if available
        let sValue = localStorage[this.lsExcludeKnownAcronyms] || '';
        if (sValue === '') {
            sValue = this.defaultExcludeKnownAcronyms;
            console.log('Using DEFAULT local storage Campus: ' + sValue);
            this.setExcludeKnownAcronyms(sValue);
        } else {
            console.log('Using EXISTING local storage Campus: ' + sValue);
            this.setExcludeKnownAcronyms(sValue);
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
