import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Quiz } from '../../../_models/Quiz';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.css',
})
export class QuizCardComponent {

    
  onStartQuiz() {
    this.startQuiz.emit(this.quiz);
  }

  @Input() quiz!: Quiz;
  @Output() startQuiz = new EventEmitter<Quiz>();
}
