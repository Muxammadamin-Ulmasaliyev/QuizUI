import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExcelReportService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}
  getReport(): Observable<{ fileUrl: string }> {
    return this.http
      .get<{ fileUrl: string }>(`${this.baseUrl}/ExcelReport/create`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
