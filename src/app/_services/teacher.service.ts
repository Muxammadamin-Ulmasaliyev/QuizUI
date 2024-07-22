import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../_models/Teacher';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<Teacher[]> {
    console.log(`${this.baseUrl}/teachers/get-all`);

    return this.http.get<Teacher[]>(`${this.baseUrl}/teachers/get-all`);
  }
}
