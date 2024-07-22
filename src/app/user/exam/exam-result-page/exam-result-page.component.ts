import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../_services/shared.service';
import { QuizResultModel } from '../../../_models/QuizResult';

@Component({
  selector: 'app-exam-result-page',
  templateUrl: './exam-result-page.component.html',
  styleUrl: './exam-result-page.component.css',
})
export class ExamResultPageComponent implements OnInit {
  constructor(private router: Router, private sharedService: SharedService) {}

  quizResult!: QuizResultModel;
  ngOnInit(): void {
    this.sharedService.currentQuizResultData.subscribe((data) => {
      this.quizResult = data;
    });
  }
  goToHome(): void {
    this.router.navigate(['/user/home/quizzes']);
  }
}
