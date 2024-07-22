import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { QuizCardComponent } from './quizzes/quiz-card/quiz-card.component';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { ExamPageComponent } from './exam/exam-page/exam-page.component';
import { ExamQuestionComponent } from './exam/exam-question/exam-question.component';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { HistoryPageComponent } from './history/history-page/history-page.component';
import { ScoreboardPageComponent } from './scoreboard/scoreboard-page/scoreboard-page.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ExamResultPageComponent } from './exam/exam-result-page/exam-result-page.component';
import { ExamReviewPageComponent } from './exam/exam-review-page/exam-review-page.component';
@NgModule({
  declarations: [
    HomeComponent,
    QuizCardComponent,
    QuizListComponent,
    ExamPageComponent,
    ExamQuestionComponent,
    HistoryPageComponent,
    ScoreboardPageComponent,
    ExamResultPageComponent,
    ExamReviewPageComponent,
  ],
  imports: [
    DropdownModule,
    TagModule,
    InputTextModule,
    PaginatorModule,
    TableModule,
    CheckboxModule,
    FormsModule,
    RadioButtonModule,
    ButtonGroupModule,
    ToastModule,
    ConfirmDialogModule,
    AvatarModule,
    SidebarModule,
    ButtonModule,
    TabMenuModule,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule {
  constructor(){
    console.log("USER MODULE LOADED");
    
  }
 }
