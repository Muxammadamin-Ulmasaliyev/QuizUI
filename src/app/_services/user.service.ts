import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { User } from '../_models/User';
import { Observable, catchError, of, throwError } from 'rxjs';
import { GetUsersPageResponseModel } from '../_models/_ResponseModels/GetUsersPageResponseModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.baseUrl}/users/my-profile`, {
      headers: headers,
    });
  }
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/id/${id}`);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/get-all`);
  }

  getChartData(year : number): Observable<{chartData : number[], availableYears : number[]}> {
    return this.http.get<{chartData : number[], availableYears : number[]}>(`${this.baseUrl}/users/signing-up-statistics/${year}`);
  }
  getSortedUsers(
    searchValue: string,
    sortField: string | undefined,
    sortOrder: number | undefined | null,
    pageNumber: number,
    pageSize: number
  ): Observable<GetUsersPageResponseModel> {
    let params = new HttpParams()
      .set('sortField', sortField!.toString())
      .set('sortOrder', sortOrder == 1 ? 'asc' : 'dsc')
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString())
      .set('searchValue', searchValue);

    const url = `${this.baseUrl}/users/get-all?${params.toString()}`;
    console.log('Requesting URL:', url);

    return this.http.get<GetUsersPageResponseModel>(
      `${this.baseUrl}/users/get-all`,
      {
        params,
      }
    );
  }

  addUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<User>(`${this.baseUrl}/users/add-new`, user, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  deleteUsers(userIds: string[]): Observable<void> {
    const options = {
      body: userIds,
    };
    return this.http.delete<void>(`${this.baseUrl}/users`, options);
  }
}
