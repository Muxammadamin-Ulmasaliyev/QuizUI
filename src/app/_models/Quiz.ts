import { Question } from "./Question";

export interface Quiz{
    id : number;
    title : string;
    questions : Question[];
    questionIdsToDelete? : number[];
    answerIdsToDelete? : number[];
}