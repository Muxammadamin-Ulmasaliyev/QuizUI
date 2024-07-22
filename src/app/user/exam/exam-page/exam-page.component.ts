import { Component, HostListener, OnInit } from '@angular/core';
import { SharedService } from '../../../_services/shared.service';
import { Quiz } from '../../../_models/Quiz';
import { QuizResultModel } from '../../../_models/QuizResult';
import { QuizResultService } from '../../../_services/quiz-result.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrl: './exam-page.component.css',
})
export class ExamPageComponent implements OnInit {

  handleSubmitQuiz(quizResult: QuizResultModel) {
    this.quizResultService.postQuizResult(quizResult).subscribe(
      (response) => {
        this.sharedService.changeQuizResultData(quizResult);
        this.router.navigate(['/user/exam-result']);
        this.sharedService.showToastMessage(
          'success',
          'Success',
          `Quiz completed successfully. Your result ${quizResult.totalScore}%`,
          3000
        );
      },

      (error) => {
        console.log(error);
      }
    );
    this.exitFullscreen();
  }
  quiz!: Quiz;
  constructor(
    private sharedService: SharedService,
    private quizResultService: QuizResultService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sharedService.currentQuizData.subscribe((data) => {
      this.quiz = data;
    });
    this.goFullscreen();
  }

  goFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
