import { Component, OnInit } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { QuizResultModel } from '../../../_models/QuizResult';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedService } from '../../../_services/shared.service';
import { QuizResultService } from '../../../_services/quiz-result.service';
import { Quiz } from '../../../_models/Quiz';
import { QuizService } from '../../../_services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css'],
})
export class HistoryPageComponent implements OnInit {
  showQuizResultReview(quizResult: QuizResultModel) {
    this.sharedService.changeQuizResultData(quizResult);
    this.router.navigate(['/user/home/exam-review']);
  }
  quizzes!: Quiz[];
  selectedQuiz!: Quiz | null;

  dropdownChanged() {
    this.loadPageOfQuizResults();
  }
  searchValue!: string;
  totalRecords: number = 0;
  pageSize: number = 5;
  pageNumber: number = 1;
  sortField: string | undefined;
  sortOrder: number | null | undefined;
  quizResults: QuizResultModel[] = [];

  constructor(
    private quizResultService: QuizResultService,
    private quizService: QuizService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizService.getAll().subscribe(
      (response) => {
        this.quizzes = response;
      },
      (error) => {}
    );
    this.loadPageOfQuizResults();

  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1; // PrimeNG paginator uses 0-based index
    this.pageSize = event.rows;
    this.loadPageOfQuizResults();
  }

  onSorted(event: TableLazyLoadEvent) {
    this.sortField = event.sortField?.toString();
    this.sortOrder = event.sortOrder;
    this.loadPageOfQuizResults();
  }

  loadPageOfQuizResults(): void {
    this.quizResultService
      .getAllQuizResultsByUserId(
        this.sortField == undefined ? 'solvedAt' : this.sortField.toString(),
        this.sortField == undefined ? -1 : this.sortOrder,
        this.pageNumber,
        this.pageSize,
        this.selectedQuiz?.id
      )
      .subscribe(
        (response: any) => {
          this.quizResults = response.quizResults;
          console.log('QUIZRESULTS HISRORY ', this.quizResults);
          this.totalRecords = response.totalRecords;
        },
        (error) => {
          console.error('Error loading quiz results:', error);
        }
      );
  }

  getGradeValue(quizResult: QuizResultModel): string | undefined {
    const score = quizResult.totalScore;

    if (score >= 80) {
      return 'A'; // A grade
    } else if (score >= 65) {
      return 'B'; // B grade
    } else if (score >= 50) {
      return 'C'; // C grade
    } else if (score >= 40) {
      return 'D'; // D grade
    } else {
      return 'F'; // F grade
    }
  }
  getGradeSeverity(
    quizResult: QuizResultModel
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    const score = quizResult.totalScore;
    if (score >= 80) {
      return 'success'; // A grade
    } else if (score >= 65) {
      return 'info'; // B grade
    } else if (score >= 50) {
      return 'secondary'; // C grade
    } else if (score >= 40) {
      return 'warning'; // D grade
    } else {
      return 'danger'; // F grade
    }
  }
}
