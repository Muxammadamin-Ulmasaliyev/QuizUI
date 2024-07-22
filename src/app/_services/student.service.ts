import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../_models/Student';
import { Observable } from 'rxjs';
import { Status } from '../_models/Status';
import { GetStudentsPageResponseModel } from '../_models/_ResponseModels/GetStudentsPageResponseModel';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}
  private header = new HttpHeaders({
    contentType: 'application/json',
  });

  updateStudent(student: Student, file: File): Observable<Student> {
    const formData: FormData = new FormData();
    formData.append('id', student.id.toString());
    formData.append('name', student.name);
    formData.append('country', student.country);
    formData.append('contract', student.contract.toString());
    formData.append('teacherId', student.teacher.id.toString());
    formData.append('status', Status[student.status]);
    formData.append('image', file);

    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
    });
    return this.http.put<Student>(
      `${this.baseUrl}/students/${student.id}`,
      formData,
      { headers: this.header }
    );
  }
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students/get-all`);
  }

  getStudents(
    pageNumber: number,
    pageSize: number
  ): Observable<GetStudentsPageResponseModel> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString());

    return this.http.get<GetStudentsPageResponseModel>(
      `${this.baseUrl}/students/get-students`,
      {
        params,
      }
    );
  }

  getSortedStudents(
    searchValue : string,
    sortField: string | undefined,
    sortOrder: number | undefined | null,
    pageNumber: number,
    pageSize: number,

  ): Observable<GetStudentsPageResponseModel> {
    let params = new HttpParams()
      .set('sortField', sortField!.toString())
      .set('sortOrder', sortOrder == 1 ? 'asc' : 'dsc')
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString())
      .set('searchValue', searchValue);


    const url = `${
      this.baseUrl
    }/students/get-students-sorted?${params.toString()}`;
    console.log('Requesting URL:', url);

    return this.http.get<GetStudentsPageResponseModel>(
      `${this.baseUrl}/students/get-students-sorted`,
      {
        params,
      }
    );
  }

  addStudent(student: Student, file: File): Observable<Student> {
    const formData: FormData = new FormData();
    formData.append('name', student.name);
    formData.append('country', student.country);
    formData.append('contract', student.contract.toString());
    formData.append('teacherId', student.teacher.id.toString());
    formData.append('status', Status[student.status]);
    formData.append('image', file);

    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
    });

    return this.http.post<Student>(
      `${this.baseUrl}/students/add-new`,
      formData,
      { headers }
    );
  }

  deleteStudents(studentIds: number[]): Observable<void> {
    const options = {
      body: studentIds,
    };
    return this.http.delete<void>(`${this.baseUrl}/students`, options);
  }
}
