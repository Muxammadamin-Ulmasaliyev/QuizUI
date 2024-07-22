import { Component, Input, OnInit } from '@angular/core';
import { Quiz } from '../../../_models/Quiz';
import { QuizService } from '../../../_services/quiz.service';
import { SharedService } from '../../../_services/shared.service';
import { ConfirmationService } from 'primeng/api';
import { ExcelReportService } from '../../../_services/excel-report.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.css',
})
export class QuizListComponent implements OnInit {
  downloadReportFile() {

    this.excelReportService.getReport().subscribe(
      (response: { fileUrl: string }) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = response.fileUrl;
        downloadLink.download = `Report-${new Date().getDate()}.xlsx`;
        downloadLink.target = '_blank'; // Optional: Open in new tab
        downloadLink.click();
      },
      (error) => {
        console.error('Error fetching excel file URL:', error);
      }
    );
  }
  handleSaveQuiz(quiz: Quiz) {
    this.quizService.updateQuiz(quiz).subscribe(
      (response) => {
        this.sharedService.showToastMessage(
          'success',
          'Successfull',
          'Quiz updated successfully!',
          3000
        );
        this.getQuizzes();
      },
      (error) => console.error('Error while updating  :', error)
    );
  }
  newQuizAdded(quiz: Quiz) {
    this.quizService.createQuiz(quiz).subscribe(
      (quizzes) => {
        this.sharedService.showToastMessage(
          'success',
          'Successfull',
          'Quiz added successfully!',
          3000
        );
      },
      (error) => console.error('Error adding :', error)
    );
  }
  confirmDeletion(quiz: Quiz): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the quiz "${quiz.title}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteQuiz(quiz.id);
      },
    });
  }

  deleteQuiz(quizIdToDelete: number) {
    this.quizService.deleteQuiz(quizIdToDelete).subscribe(
      (quizzes) => {
        this.sharedService.showToastMessage(
          'success',
          'Successfull',
          'Quiz deleted successfully!',
          3000
        );
        this.getQuizzes();
      },
      (error) => console.error('Error deleting :', error)
    );
  }

  onAddQuiz() {
    this.displayAddDialog = true;
  }

  dialogAddHided() {
    this.displayAddDialog = false;
  }

  dialogHided() {
    this.displayDialog = false;
    this.displayAddDialog = false;
    this.getQuizzes();
  }

  constructor(
    private quizService: QuizService,
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private excelReportService: ExcelReportService
  ) {}
  ngOnInit(): void {
    this.getQuizzes();
  }

  getQuizzes(): void {
    this.quizService.getAll().subscribe(
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
  displayAddDialog: boolean = false;

  openEditDialog(quiz: Quiz): void {
    this.selectedQuiz = quiz;
    this.displayDialog = true;
  }
}
