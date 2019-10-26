import { Option } from './option';

export class Acronym {
    acronymID: string;
    acronym: string;
    index: string;
    moreURL: string;
    options: Option[];
    answered: boolean;

    constructor(data: any) {
        data = data || {};
        this.acronymID = data.Acronym + data.Index;
        this.acronym = data.Acronym;
        this.index = data.Index;
        this.moreURL = data.MoreURL;
        this.options = [];
        data.options.forEach(o => {
            this.options.push(new Option(o));
        });
    }
}
