import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Question } from '../_models/Question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}
  createQuestion(question: Question): Observable<Question> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Question>(`${this.baseUrl}/questions`, question, { headers })
      .pipe(
        catchError(this.handleError<Question>('createquestion'))
      );
  }

  // Get all quizzes
  getAll(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions/get-all`)
      .pipe(
        catchError(this.handleError<Question[]>('getAll', []))
      );
  }

  // Get a quiz by ID
  getQuestionById(id: number): Observable<Question> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Question>(url)
      .pipe(
        catchError(this.handleError<Question>(`getQuestionById id=${id}`))
      );
  }

  // Update a quiz
  updateQuiz(quiz: Question): Observable<Question> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Question>(this.baseUrl, quiz, { headers })
      .pipe(
        catchError(this.handleError<Question>('updateQuestion'))
      );
  }

  // Delete a quiz
  deleteQuestion(id: number): Observable<Question> {
    const url = `${this.baseUrl}/quizzes/${id}`;
    return this.http.delete<Question>(url)
      .pipe(
        catchError(this.handleError<Question>('deleteQuestion'))
      );
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
