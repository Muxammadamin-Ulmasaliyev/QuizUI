import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { ExamPageComponent } from './exam/exam-page/exam-page.component';
import { HistoryPageComponent } from './history/history-page/history-page.component';
import { ScoreboardPageComponent } from './scoreboard/scoreboard-page/scoreboard-page.component';
import { ExamResultPageComponent } from './exam/exam-result-page/exam-result-page.component';
import { ExamReviewPageComponent } from './exam/exam-review-page/exam-review-page.component';
import { AuthGuardService } from '../_services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/quizzes',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'quizzes',
        component: QuizListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'history',
        component: HistoryPageComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'scoreboard',
        component: ScoreboardPageComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'exam-review',
        component: ExamReviewPageComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'exam',
    component: ExamPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'exam-result',
    component: ExamResultPageComponent,
    canActivate: [AuthGuardService],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
