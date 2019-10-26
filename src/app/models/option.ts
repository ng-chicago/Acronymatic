export class Option {
    id: number;
    acronymId: number;
    spelledOut: string;
    isAnswer: boolean;
    selected: boolean;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.acronymId = data.acronymId;
        this.spelledOut = data.spelledOut;
        this.isAnswer = data.isAnswer;
    }
}
