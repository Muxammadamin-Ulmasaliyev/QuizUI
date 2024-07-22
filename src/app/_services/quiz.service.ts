import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable, catchError, of } from 'rxjs';
import { Quiz } from '../_models/Quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createQuiz(quiz: Quiz): Observable<Quiz> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<Quiz>(`${this.baseUrl}/quizzes`, quiz, { headers })
      .pipe(catchError(this.handleError<Quiz>('createQuiz')));
  }

  // Get all quizzes
  getAll(): Observable<Quiz[]> {
    return this.http
      .get<Quiz[]>(`${this.baseUrl}/quizzes/get-all`)
      .pipe(catchError(this.handleError<Quiz[]>('getAll', [])));
  }
  getAllForUser(): Observable<Quiz[]> {
    return this.http
      .get<Quiz[]>(`${this.baseUrl}/quizzes/get-all-for-user`)
      .pipe(catchError(this.handleError<Quiz[]>('getAllForUser', [])));
  }
  // Get a quiz by ID
  getQuizById(id: number): Observable<Quiz> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .get<Quiz>(url)
      .pipe(catchError(this.handleError<Quiz>(`getQuizById id=${id}`)));
  }

  // Update a quiz
  updateQuiz(quiz: Quiz): Observable<Quiz> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .put<Quiz>(`${this.baseUrl}/quizzes/${quiz.id}`, quiz, {
        headers,
      })
      .pipe(catchError(this.handleError<Quiz>('updateQuiz')));
  }

  // Delete a quiz
  deleteQuiz(id: number): Observable<Quiz> {
    const url = `${this.baseUrl}/quizzes/${id}`;
    return this.http
      .delete<Quiz>(url)
      .pipe(catchError(this.handleError<Quiz>('deleteQuiz')));
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
