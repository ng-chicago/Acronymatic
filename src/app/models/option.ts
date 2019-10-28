export class Option {
    id: number;
    acronymID: string;
    spelledOut: string;
    isAnswer: boolean;
    selected?: boolean;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.acronymID = data.acronymID;
        this.spelledOut = data.spelledOut;
        this.isAnswer = data.isAnswer;
    }
}
