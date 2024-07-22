import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { QuoteModel } from '../_models/QuoteModel';

@Injectable({
  providedIn: 'root',
})
export class ZenQuotesService {
  private zenQuotesApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<QuoteModel[]> {
    return this.http
      .get<QuoteModel[]>(`${this.zenQuotesApiUrl}/misc/zenquotes`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
