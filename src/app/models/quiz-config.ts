export class QuizConfig {
    allowBack: boolean;
    allowReview: boolean;
    autoMove: boolean;  // if boolean; it will move to next acronym automatically when answered.
    duration: number;  // indicates the time in which quiz needs to be completed. 0 means unlimited.
    pageSize: number;
    requiredAll: boolean;  // indicates if you must answer all the acronyms before submitting.
    richText: boolean;
    shuffleAcronyms: boolean;
    shuffleOptions: boolean;
    showClock: boolean;
    showPager: boolean;
    theme: string;

    constructor(data: any) {
        data = data || {};
        this.allowBack = data.allowBack;
        this.allowReview = data.allowReview;
        this.autoMove = data.autoMove;
        this.duration = data.duration;
        this.pageSize = data.pageSize;
        this.requiredAll = data.requiredAll;
        this.richText = data.richText;
        this.shuffleAcronyms = data.shuffleAcronyms;
        this.shuffleOptions = data.shuffleOptions;
        this.showClock = data.showClock;
        this.showPager = data.showPager;
    }
}
