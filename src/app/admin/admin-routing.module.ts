import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsListComponent } from './students/students-list/students-list.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { UsersPageComponent } from './users/users-page/users-page.component';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { AuthGuardService } from '../_services/auth-guard.service';
import { AdminGuardService } from '../_services/admin-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService, AdminGuardService],
    children: [
      {
        path: 'students',
        component: StudentsListComponent,
        canActivate: [AuthGuardService, AdminGuardService],
      },
      {
        path: 'users',
        component: UsersPageComponent,
        canActivate: [AuthGuardService, AdminGuardService],
      },
      {
        path: 'quizzes',
        component: QuizListComponent,
        canActivate: [AuthGuardService, AdminGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
