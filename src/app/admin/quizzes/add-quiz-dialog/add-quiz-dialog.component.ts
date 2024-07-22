import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Quiz } from '../../../_models/Quiz';

@Component({
  selector: 'app-add-quiz-dialog',
  templateUrl: './add-quiz-dialog.component.html',
  styleUrl: './add-quiz-dialog.component.css',
})
export class AddQuizDialogComponent {
  isModelStateValid() {
    return this.quiz.title.trim().length > 0 && this.quiz.title.trim() !== '';
  }
  quiz: Quiz = { id: 0, title: '', questions: [], questionIdsToDelete: [] };

  onSaveQuiz() {
    this.quiz.title = this.quiz.title.trim();
    this.addNewQuiz.emit(this.quiz);
    this.onHideDialog();
    this.quiz = { id: 0, title: '', questions: [], questionIdsToDelete: [] };
  }

  onHideDialog() {
    
    this.dialogHide.emit();
    this.quiz = { id: 0, title: '', questions: [], questionIdsToDelete: [] };

  }

  @Output() addNewQuiz = new EventEmitter<Quiz>();
  @Output() dialogHide = new EventEmitter<void>();
  @Input() displayAddDialog!: boolean;
}
