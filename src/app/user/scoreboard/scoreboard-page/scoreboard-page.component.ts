import { Component } from '@angular/core';
import { QuizResultModel } from '../../../_models/QuizResult';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedService } from '../../../_services/shared.service';
import { QuizResultService } from '../../../_services/quiz-result.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { QuizService } from '../../../_services/quiz.service';
import { Quiz } from '../../../_models/Quiz';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-scoreboard-page',
  templateUrl: './scoreboard-page.component.html',
  styleUrl: './scoreboard-page.component.css',
})
export class ScoreboardPageComponent {
  dropdownChanged() {
    this.loadPageOfQuizResults();
  }
  totalRecords: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  sortField: string | undefined;
  sortOrder: number | null | undefined;
  quizResults: QuizResultModel[] = [];
  quizzes!: Quiz[];
  selectedQuiz!: Quiz | null;
  
  searchValue: string = '';
  searchSubject: Subject<string> = new Subject();
  private destroy$ = new Subject<void>();

  constructor(
    private quizResultService: QuizResultService,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.quizService.getAll().subscribe(
      (response) => {
        this.quizzes = response;
      },
      () => {}
    );
    this.searchSubject
      .pipe(
        debounceTime(400), // Adjust the debounce time as needed
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadPageOfQuizResults();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: any) {
    this.searchSubject.next(event.target.value);
  }


  
  onPageChange(event: any) {
    this.pageNumber = event.page + 1; // PrimeNG paginator uses 0-based index
    this.pageSize = event.rows;
    this.loadPageOfQuizResults();
  }

  clearTableFilter(table: any) {
    this.selectedQuiz = null;
    table.clear();
    this.searchValue = '';
    this.loadPageOfQuizResults();
  }

  onSorted(event: TableLazyLoadEvent) {
    this.sortField = event.sortField?.toString();
    this.sortOrder = event.sortOrder;
    console.log(this.sortField);

    this.loadPageOfQuizResults();
  }

  loadPageOfQuizResults(): void {
    this.quizResultService
      .getAll(
        this.sortField == undefined ? 'solvedAt' : this.sortField.toString(),
        this.sortField == undefined ? -1 : this.sortOrder,
        this.pageNumber,
        this.pageSize,
        this.searchValue,
        this.selectedQuiz ? this.selectedQuiz.id : null
      )
      .subscribe(
        (response: any) => {
          this.quizResults = response.quizResults;
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
