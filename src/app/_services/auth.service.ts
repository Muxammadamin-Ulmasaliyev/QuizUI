import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../environment';
import { UserRegisterModel } from '../_models/UserRegisterModel';
import { ConfirmEmailModel } from '../_models/ConfirmEmailModel';
import { LoginModel } from '../_models/LoginModel';
import { User } from '../_models/User';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSignal = signal<User | undefined | null>(undefined);

  private baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  login(credentials: LoginModel): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      map(() => true),
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUserRole(): string {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = this.jwtHelper.decodeToken(token);
        console.log(decodedToken);

        return decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];
      } catch (error) {
        console.error('Error Decoding Token:', error); // Debugging: Log any errors
      }
    }
    return '';
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = this.jwtHelper.decodeToken(token);
    const currentTime = Date.now().valueOf() / 1000;
    return decoded.exp < currentTime;
  }
  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);


      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return (
        roles === 'Admin' || roles == 'SuperAdmin' || roles.includes('Admin') || roles.includes('SuperAdmin')
      );
    }
    return false;
  }

  register(registerModel: UserRegisterModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, registerModel);
  }

  confirmEmail(email: string, code: string): Observable<any> {
    const confirmEmailModel: ConfirmEmailModel = { code: code, email: email };
    return this.http.post<ConfirmEmailModel>(
      `${this.baseUrl}/auth/confirm-email`,
      confirmEmailModel
    );
  }
}
