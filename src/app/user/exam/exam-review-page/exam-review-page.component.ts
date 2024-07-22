import { Component, Input } from '@angular/core';
import { Quiz } from '../../../_models/Quiz';
import { Question } from '../../../_models/Question';
import { QuizResultService } from '../../../_services/quiz-result.service';
import { ConfirmationService } from 'primeng/api';
import { SharedService } from '../../../_services/shared.service';
import { Router } from '@angular/router';
import { QuizResultModel } from '../../../_models/QuizResult';
import { json } from 'express';

@Component({
  selector: 'app-exam-review-page',
  templateUrl: './exam-review-page.component.html',
  styleUrl: './exam-review-page.component.css',
})
export class ExamReviewPageComponent {
goBack() {
throw new Error('Method not implemented.');
}

  quizResult!: QuizResultModel;
  currentQuestion!: Question | undefined;
  currentIndex: number = 0;

  constructor(
    private quizResultService: QuizResultService,
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sharedService.currentQuizResultData.subscribe((data) => {
      this.quizResult = data;
    });
    
    this.currentQuestion = this.quizResult?.quiz?.questions[this.currentIndex];
    
    console.log('THIS IS QUIZ RESULT : ');
    console.log(this.quizResult);
    
    console.log('SELECTED RADIOS : ');
    console.log(this.quizResult.selectedRadioButtonAnswers);
  }

  showNextQuestion() {
    const questions = this.quizResult?.quiz?.questions ?? [];
    if (this.currentIndex < questions.length - 1) {
      this.currentIndex++;
      this.currentQuestion = questions[this.currentIndex];
    } else {
      console.log('UNDEFIEND QUESITNOS');
    }
  }

  showPreviousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentQuestion =
        this.quizResult?.quiz?.questions[this.currentIndex];
    }
  }

  showQuestion(selectedQuestionIndex: number) {
    this.currentQuestion =
      this.quizResult?.quiz?.questions[selectedQuestionIndex];
    this.currentIndex = selectedQuestionIndex;

    console.log(this.currentQuestion);
    console.log(this.quizResult.selectedRadioButtonAnswers);
  }

  isNextButtonDisabled(): boolean {
    const questions = this.quizResult?.quiz?.questions ?? [];

    return this.currentIndex >= questions.length - 1;
  }

  isPreviousButtonDisabled(): boolean {
    return this.currentIndex <= 0;
  }
}
