import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { AdminRoutingModule } from './admin-routing.module';
import { StudentsListComponent } from './students/students-list/students-list.component';
import { StudentsTableComponent } from './students/students-table/students-table.component';
import { StudentDialogComponent } from './students/student-dialog/student-dialog.component';
import { TableModule } from 'primeng/table';

import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { HomeComponent } from './home/home.component';
import { UsersPageComponent } from './users/users-page/users-page.component';
import { UsersTableComponent } from './users/users-table/users-table.component';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { QuizCardComponent } from './quizzes/quiz-card/quiz-card.component';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { EditQuizDialogComponent } from './quizzes/edit-quiz-dialog/edit-quiz-dialog.component';
import { AddQuizDialogComponent } from './quizzes/add-quiz-dialog/add-quiz-dialog.component';
import { LineChartComponent } from './users/line-chart/line-chart.component';
@NgModule({
  declarations: [
    StudentsListComponent,
    DashboardComponent,
    StudentsTableComponent,
    StudentDialogComponent,
    HomeComponent,
    QuizListComponent,
    UsersPageComponent,
    UsersTableComponent,
    UserDialogComponent,
    QuizCardComponent,
    QuizListComponent,
    EditQuizDialogComponent,
    AddQuizDialogComponent,
    LineChartComponent,
  ],
  imports: [
    AccordionModule,
    FormsModule,
    SelectButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    ButtonGroupModule,
    CardModule,
    RadioButtonModule,
    MenubarModule,
    DialogModule,
    TableModule,
    CommonModule,
    TabMenuModule,
    AdminRoutingModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PaginatorModule,
    TagModule,
    ConfirmDialogModule,
    AvatarModule,
    ToastModule,
    ChartModule
  ],
})
export class AdminModule {
  constructor() {
    console.log('Admin module loaded');
  }
}
