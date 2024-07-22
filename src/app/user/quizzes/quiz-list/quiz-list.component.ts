import { Component } from '@angular/core';
import { Quiz } from '../../../_models/Quiz';
import { QuizService } from '../../../_services/quiz.service';
import { ConfirmationService } from 'primeng/api';
import { SharedService } from '../../../_services/shared.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.css',
})
export class QuizListComponent {
  handleStartQuiz(quiz: Quiz) {
    this.sharedService.changeQuizData(quiz);
    this.router.navigate(['/user/exam']);
  }
  constructor(
    private quizService: QuizService,
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getQuizzes();
  }

  getQuizzes(): void {
    this.quizService.getAllForUser().subscribe(
      (quizzes) => (this.quizzesList = quizzes),
      (error) => console.error('Error fetching quizzes:', error)
    );
  }

  quizzesList!: Quiz[];
  selectedQuiz: Quiz = {
    id: 0,
    title: '',
    questions: [],
    questionIdsToDelete: [],
  };
  displayDialog: boolean = false;
}
