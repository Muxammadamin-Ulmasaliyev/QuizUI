import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Quiz } from '../../../_models/Quiz';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.css',
})
export class QuizCardComponent {
  onDeleteQuiz() {
    this.deleteQuiz.emit(this.quiz);
  }

  @Input() quiz!: Quiz;
  @Output() editQuiz = new EventEmitter<Quiz>();
  @Output() deleteQuiz = new EventEmitter<Quiz>();

  onEdit() {
    this.editQuiz.emit(this.quiz);
  }
}
