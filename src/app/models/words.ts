export class Words {
    word: string;

    constructor(data: any) {
        data = data || {};
        this.word = data.acronym + data.word;
    }
}
