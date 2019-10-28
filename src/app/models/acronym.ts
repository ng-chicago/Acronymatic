import { Option } from './option';

export class Acronym {
    acronymID: string;
    acronym: string;
    acronymTypeId: number;
    index: string;
    moreURL: string;
    options: Option[];
    answered: boolean;

    constructor(data: any) {
        data = data || {};
        this.acronymID = data.acronym + data.index;
        this.acronym = data.acronym;
        this.acronymTypeId = data.acronymTypeId;
        this.index = data.index;
        this.moreURL = data.moreURL;
        this.options = [];
        data.options.forEach(o => {
            this.options.push(new Option(o));
        });
        this.answered = data.answered;
    }
}
