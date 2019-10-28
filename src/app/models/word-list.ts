export class WordList {
    word: string;
    description: string;

    constructor(data: any) {
        data = data || {};
        this.word = data.acronym + data.word;
        this.description = data.description;
    }
}
