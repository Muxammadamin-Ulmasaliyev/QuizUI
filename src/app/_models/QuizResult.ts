import { Quiz } from "./Quiz";
import { User } from "./User";

export interface QuizResultModel{
    id? : number;
    userId : string | null;
    user? : User;
    quizId : number;
    quiz? : Quiz;
    totalScore : number;
    solvedAt? : Date;

    selectedRadioButtonAnswers : number[];
    selectedCheckboxAnswers : boolean[][];
    
    
}