import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quiz } from '../../../_models/Quiz';
import { Question } from '../../../_models/Question';
import { RadioButtonClickEvent } from 'primeng/radiobutton';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { Answer } from '../../../_models/Answer';
import { ConfirmationService } from 'primeng/api';
import { QuizResultService } from '../../../_services/quiz-result.service';
import { QuizResultModel } from '../../../_models/QuizResult';
import { SharedService } from '../../../_services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-question',
  templateUrl: './exam-question.component.html',
  styleUrl: './exam-question.component.css',
})
export class ExamQuestionComponent implements OnInit {
  test() {
    let quizResult: QuizResultModel = {
      userId: '520b5669-2bdd-490c-9314-9ded02e72f8a',
      quizId: this.quiz.id,
      totalScore: this.calculateTotalScore(),
      selectedRadioButtonAnswers: this.selectedRadioButtonAnswers,
      selectedCheckboxAnswers: this.selectedCheckBoxAnswers,
    };
    console.log(quizResult);
  }
  constructor(
    private quizResultService: QuizResultService,
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.timeLeft = this.quiz.questions.length * 60; // Set the quiz duration in seconds (e.g., 600 seconds = 10 minutes)
    this.startTimer();
    this.currentQuestion = this.quiz.questions[this.currentIndex];
    this.results = new Array(this.quiz.questions.length).fill(false);

    this.initializeSelectedAnswers();
  }

  initializeSelectedAnswers(): void {
    this.selectedCheckBoxAnswers = this.quiz.questions.map((question) =>
      new Array(question.answers.length).fill(false)
    );

    this.selectedRadioButtonAnswers = this.quiz.questions.map((question) => -1);
  }

  @Input() quiz!: Quiz;
  currentQuestion!: Question;
  currentIndex: number = 0;

  selectedCheckBoxAnswers!: boolean[][];
  selectedRadioButtonAnswers: number[] = [];

  results!: boolean[];
  visitedQuestionIndexes: number[] = [];
  @Output() submitQuiz = new EventEmitter<QuizResultModel>();
  timeLeft!: number; // Set the quiz duration in seconds (e.g., 600 seconds = 10 minutes)
  interval: any;
  isTimerRunning: boolean = false;

  calculateTotalScore(): number {
    return Math.round(
      (this.results.filter((r) => r === true).length /
        this.quiz.questions.length) *
        100
    );
  }

  checkBoxSelectionChanged(event: CheckboxChangeEvent, checkedAnswer: Answer) {
    let result: boolean = true;
    let correctAnswersCount = this.currentQuestion.answers.filter(
      (answer) => answer.isCorrect
    ).length;
    let count = 0;
    for (let i = 0; i < this.currentQuestion.answers.length; i++) {
      if (
        this.currentQuestion.answers[i].isCorrect &&
        this.selectedCheckBoxAnswers[this.currentIndex][i]
      ) {
        count++;
      } else if (
        !this.currentQuestion.answers[i].isCorrect &&
        this.selectedCheckBoxAnswers[this.currentIndex][i]
      ) {
        result = false;
      }
    }
    if (result) {
      result = count === correctAnswersCount;
    }
    this.results[this.currentIndex] = result;
  }
  radioButtonSelectionChanged(event: RadioButtonClickEvent) {
    console.log(
      'is answer true : ',
      this.currentQuestion.answers[event.value].isCorrect
    );

    this.results[this.currentIndex] =
      this.currentQuestion.answers[event.value].isCorrect;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
  startTimer(): void {
    this.isTimerRunning = true;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.handleSubmitQuiz();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.isTimerRunning = false;
    }
  }
  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  handleSubmitQuiz() {
    console.log(this.results);

    let quizResult: QuizResultModel = {
      userId: localStorage.getItem('userId'),
      quizId: this.quiz.id,
      totalScore: this.calculateTotalScore(),
      selectedRadioButtonAnswers: this.selectedRadioButtonAnswers,
      selectedCheckboxAnswers: this.selectedCheckBoxAnswers,
    };

    this.submitQuiz.emit(quizResult);
  }

  showConfirmationDialog() {
    this.confirmationService.confirm({
      message: `Are you sure you want to finish the quiz "${this.quiz.title}"?`,
      header: 'Confirm completion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.handleSubmitQuiz();
      },
    });
  }

  showNextQuestion() {
    if (this.currentIndex < this.quiz.questions.length - 1) {
      this.visitedQuestionIndexes.push(this.currentIndex);

      this.currentIndex++;
      for (let i = this.currentIndex; i <= this.quiz.questions.length; i++) {
        if (this.visitedQuestionIndexes.indexOf(this.currentIndex) === -1) {
          this.currentQuestion = this.quiz.questions[this.currentIndex];
        } else {
          this.currentIndex++;
        }
      }

      console.log(this.visitedQuestionIndexes);
      console.log('current ', this.currentIndex);
    }
  }

  showPreviousQuestion() {
    if (this.currentIndex > 0) {
      this.visitedQuestionIndexes.push(this.currentIndex);

      this.currentIndex--;
      for (let i = this.currentIndex; i >= 0; i--) {
        if (this.visitedQuestionIndexes.indexOf(this.currentIndex) === -1) {
          this.currentQuestion = this.quiz.questions[this.currentIndex];
        } else {
          this.currentIndex--;
        }
      }

      console.log(this.visitedQuestionIndexes);
      console.log('current ', this.currentIndex);
    }
  }

  showQuestion(selectedQuestionIndex: number) {
    this.visitedQuestionIndexes.push(this.currentIndex);

    this.currentQuestion = this.quiz.questions[selectedQuestionIndex];
    this.currentIndex = selectedQuestionIndex;

    console.log(this.visitedQuestionIndexes);
    console.log('current ', this.currentIndex);
  }

  isNextButtonDisabled(): boolean {
    let nextIndex = this.currentIndex + 1;
    while (
      nextIndex < this.quiz.questions.length &&
      this.visitedQuestionIndexes.includes(nextIndex)
    ) {
      nextIndex++;
    }
    return nextIndex >= this.quiz.questions.length;
  }
  isPreviousButtonDisabled(): boolean {
    let prevIndex = this.currentIndex - 1;
    while (prevIndex >= 0 && this.visitedQuestionIndexes.includes(prevIndex)) {
      prevIndex--;
    }
    return prevIndex < 0;
  }

  isQuestionVisitedOnce(index: number) {
    return this.visitedQuestionIndexes.findIndex((i) => i === index) !== -1;
  }
}
