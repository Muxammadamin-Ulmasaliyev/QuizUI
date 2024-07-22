import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { QuizResultModel } from '../_models/QuizResult';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizResultService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postQuizResult(quizResult: QuizResultModel): Observable<QuizResultModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<QuizResultModel>(`${this.baseUrl}/quizresults`, quizResult, {
        headers,
      })
      .pipe(catchError(this.handleError<QuizResultModel>('createQuizResult')));
  }

  // Get all quizzes
  getAll(
    sortField: string | undefined,
    sortOrder: number | undefined | null,
    pageNumber: number,
    pageSize: number,
    searchValue: string,
    quizId?: number | null
  ): Observable<QuizResultModel[]> {
    let params = new HttpParams()
      .set('sortField', sortField!.toString())
      .set('sortOrder', sortOrder == 1 ? 'asc' : 'dsc')
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString())
      .set('searchValue', searchValue);

    if (quizId != null) {
      params = params.set('quizId', quizId.toString());
    }

    return this.http
      .get<QuizResultModel[]>(
        `${this.baseUrl}/quizresults/get-quizresults-sorted`,
        { params: params }
      )
      .pipe(
        catchError(
          this.handleError<QuizResultModel[]>('get-quizresults-sorted', [])
        )
      );
  }
  getAllQuizResultsByUserId(
    sortField: string | undefined,
    sortOrder: number | undefined | null,
    pageNumber: number,
    pageSize: number,
    quizId?: number | null
  ): Observable<QuizResultModel[]> {
    let params = new HttpParams()
      .set('sortField', sortField!.toString())
      .set('sortOrder', sortOrder == 1 ? 'asc' : 'dsc')
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString())

    if (quizId != null) {
      params = params.set('quizId', quizId.toString());
    }

    return this.http
      .get<QuizResultModel[]>(
        `${this.baseUrl}/quizresults/get-quizresults-history-sorted`,
        { params: params }
      )
      .pipe(catchError(this.handleError<QuizResultModel[]>('getAll', [])));
  }
  // Get a quiz by ID
  getQuizResultById(id: number): Observable<QuizResultModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .get<QuizResultModel>(url)
      .pipe(
        catchError(
          this.handleError<QuizResultModel>(`getQuestionById id=${id}`)
        )
      );
  }

  // Update a quiz
  updateQuizResult(quizResult: QuizResultModel): Observable<QuizResultModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<QuizResultModel>(this.baseUrl, quizResult, { headers })
      .pipe(catchError(this.handleError<QuizResultModel>('updateQuizResult')));
  }

  // Delete a quiz
  deleteQuizResult(id: number): Observable<QuizResultModel> {
    const url = `${this.baseUrl}/quizresults/${id}`;
    return this.http
      .delete<QuizResultModel>(url)
      .pipe(catchError(this.handleError<QuizResultModel>('deleteQuizResult')));
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
