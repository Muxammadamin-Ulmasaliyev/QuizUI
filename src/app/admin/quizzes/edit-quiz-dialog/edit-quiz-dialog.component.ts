import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Quiz } from '../../../_models/Quiz';
import { Question } from '../../../_models/Question';
import { SelectButtonChangeEvent } from 'primeng/selectbutton';

@Component({
  selector: 'app-edit-quiz-dialog',
  templateUrl: './edit-quiz-dialog.component.html',
  styleUrl: './edit-quiz-dialog.component.css',
})
export class EditQuizDialogComponent implements OnChanges {
  isModelStateValid(): boolean {
    let result = true;
    
    // Check if the quiz has a title and at least one question
    if (this.quiz.title.length === 0 ) {
      return false;
    }
  
    // Iterate through each question to validate it
    this.quiz.questions.forEach((question) => {
      if (question.text.length === 0) {
        result = false;
      }
  
      // Check if there's at least one correct answer
      if (!question.answers.some((a) => a.isCorrect)) {
        result = false;
      }
  
      // Check each answer in the question
      question.answers.forEach((answer) => {
        if (answer.text.length === 0) {
          result = false;
        }
      });
    });
  
    return result;
  }
  
  radioButtonChanged(questionIndex: number, answerIndex: number) {
    const selectedAnswerIndex =
      this.quiz.questions[questionIndex].selectedAnswerIndex;

    //this.quiz.questions[questionIndex].answers[selectedAnswerIndex].isCorrect = true;

    this.quiz.questions[questionIndex].answers.forEach((answer, index) => {
      // Set isCorrect to true only for the selectedAnswerIndex, false for others
      answer.isCorrect = index === selectedAnswerIndex;
    });
  }
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.quiz.questions.forEach((question) => {
      for (let i = 0; i < question.answers.length; i++) {
        
        if (question.answers[i].isCorrect) {
          question.selectedAnswerIndex = i;
          return;
        }
      }
    });
  }

  groupButtonSelectionChanged(
    event: SelectButtonChangeEvent,
    questionIndex: number
  ) {
    // event.value === true => Multiple choice
    // event.value === false => Single choice
    this.quiz.questions[questionIndex].selectedAnswerIndex = -1;
  }

  @Output() saveQuiz = new EventEmitter<Quiz>();
  @Input() quiz!: Quiz;
  @Input() displayDialog!: boolean;
  @Output() dialogHide = new EventEmitter<void>();

  onSaveQuiz() {
    this.saveQuiz.emit(this.quiz);
    this.quiz.questionIdsToDelete = [];
    this.handleDialogHide();
  }

  questionTypes: any[] = [
    { label: 'Single choice', value: false },
    { label: 'Multiple choice', value: true },
  ];

  test() {
    console.log('QUIZ : : : : : : : : : ');
    console.log(this.quiz);
  }

  trackByQuestion(index: number, question: Question): number {
    return question.id;
  }

  trackByAnswer(index: number, answer: string): number {
    return index;
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    if (
      answerIndex > -1 &&
      answerIndex < this.quiz.questions[questionIndex].answers.length
    ) {
      if (
        this.quiz.answerIdsToDelete === null ||
        this.quiz.answerIdsToDelete === undefined
      ) {
        this.quiz.answerIdsToDelete = [];
      }

      if (this.quiz.questions[questionIndex].answers[answerIndex].id) {
        this.quiz.answerIdsToDelete.push(
          this.quiz.questions[questionIndex].answers[answerIndex].id
        );
      }

      this.quiz.questions[questionIndex].answers.splice(answerIndex, 1);
    }
  }

  addAnswer(questionIndex: number) {
    this.quiz.questions[questionIndex].answers.push({
      id: 0,
      text: '',
      isCorrect: false,
    });
  }

  removeQuestion(question: Question, index: number) {
    if (index > -1 && index < this.quiz.questions.length) {
      if (
        this.quiz.questionIdsToDelete === null ||
        this.quiz.questionIdsToDelete === undefined
      ) {
        this.quiz.questionIdsToDelete = [];
      }

      if (this.quiz.questions[index].id) {
        this.quiz.questionIdsToDelete.push(question.id);
      }

      this.quiz.questions.splice(index, 1);
    }
  }

  addQuestion() {
    this.quiz.questions.push({
      id: 0,
      text: '',
      answers: [],
      isMultipleChoice: false,
      selectedAnswerIndex: -1,
    });
  }

  handleDialogHide() {
    this.dialogHide.emit();
    this.quiz.questionIdsToDelete = [];
  }

  // VALIDATIONS
}
