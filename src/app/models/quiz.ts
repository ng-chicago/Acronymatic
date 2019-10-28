import { QuizConfig } from './quiz-config';
import { Acronym } from './acronym';

export class Quiz {
    id: number;
    name: string;
    description: string;
    config: QuizConfig;
    acronyms: Acronym[];

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.config = new QuizConfig(data.config);
            this.acronyms = [];
            data.acronyms.forEach(q => {
                this.acronyms.push(new Acronym(q));
            });
        }
    }
}
