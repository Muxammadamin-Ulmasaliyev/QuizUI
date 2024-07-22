import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { Quiz } from '../_models/Quiz';
import { QuizResultModel } from '../_models/QuizResult';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private messageService: MessageService) {}

  private quizDataSource = new BehaviorSubject<any>(null);
  private quizResultDataSource = new BehaviorSubject<any>(null);
  private emailDataSource = new BehaviorSubject<any>(null);
  private currentUser$ = new BehaviorSubject<User | undefined>(undefined);



  currentQuizData = this.quizDataSource.asObservable();
  currentQuizResultData = this.quizResultDataSource.asObservable();
  currentEmailData = this.emailDataSource.asObservable();


  setCurrentUser(){
    
  }

  changeQuizData(quiz: Quiz) {
    this.quizDataSource.next(quiz);
  }
  changeQuizResultData(quizResult: QuizResultModel) {
    this.quizResultDataSource.next(quizResult);
  }

  changeEmailData(email: string) {
    this.emailDataSource.next(email);
  }

  showToastMessage(
    severity: string,
    summary: string,
    detail: string,
    life?: number
  ): void {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life ? life : 3000,
    });
  }
}
