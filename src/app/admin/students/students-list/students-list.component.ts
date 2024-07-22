import { Component } from '@angular/core';
import { Student } from '../../../_models/Student';
import { countryFlagUrls, countryNames } from '../../../_data/CountryFlagUrls';
import { Teacher } from '../../../_models/Teacher';
import { StudentService } from '../../../_services/student.service';
import { TeacherService } from '../../../_services/teacher.service';
import { Status } from '../../../_models/Status';
import { SharedService } from '../../../_services/shared.service';
@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.css',
})
export class StudentsListComponent {
  handleStudentDeletion(event: { studentIdsToDelete: number[] }) {
    this.studentService.deleteStudents(event.studentIdsToDelete).subscribe(
      (response) => {
        this.loadPageOfStudents();
        this.sharedService.showToastMessage(
          'success',
          'Successful',
          'Students deleted!',
          3000
        );

        this.selectedStudents = [];
      },
      (error) => {
        this.sharedService.showToastMessage(
          'error',
          'Error',
          'Failed to Delete Students!',
          3000
        );
      }
    );
  }

  handleDialogOpen(event: { isEditMode: boolean; newStudent: Student }) {
    this.newStudent = event.newStudent;
    this.isEditMode = event.isEditMode;
    this.displayDialog = true;
  }

  handleTableSorting(event: {
    sortField: string | string[] | null | undefined;
    sortOrder: number | null | undefined;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue : string;

  }) {
    this.loadPageOfStudents(
      event.searchValue,
      event.sortField,
      event.sortOrder,
      event.pageNumber,
      event.pageSize,
    );
  }
  handlePageChange(event: {
    sortField: string | string[] | null | undefined;
    sortOrder: number | null | undefined;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue : string;
  }) {
    this.loadPageOfStudents(
      event.searchValue,
      event.sortField,
      event.sortOrder,
      event.pageNumber,
      event.pageSize,
    );
  }

  onHideDialog() {
    this.displayDialog = false;
    this.isEditMode = false;
  }
  resetFileInput() {
    this.imagePreview = null;
  }

  imagePreview: string | ArrayBuffer | null = null;

  getStudentImageUrl(imageName: string): string {
    return `http://localhost:5229/api/Images?imageUrl=${imageName}`;
  }

  students!: Student[];
  selectedStudents!: Student[];
  teachers!: Teacher[];
  loading: boolean = true;
  countryNames: string[] = countryNames;

  displayDialog: boolean = false;

  isEditMode: boolean = false;
  newStudent: Student = {
    name: '',
    country: '',
    teacher: { name: '' },
    date: new Date(),
    contract: 0,
    status: Status.QUALIFIED,
  } as Student; 

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.loadPageOfStudents();
    this.teacherService.getAllTeachers().subscribe((teachers) => {
      this.teachers = teachers;
      this.loading = false;
    });
  }

  loadPageOfStudents(
    searchValue : string = '',
    sortField?: string | string[] | null | undefined,
    sortOrder?: number | null | undefined,
    pageNumber: number = this.pageNumber,
    pageSize: number = this.pageSize,

  ) {
    this.studentService
      .getSortedStudents(
        searchValue, 
        sortField == undefined ? 'date' : sortField.toString(),
        sortField == undefined ? -1 : sortOrder,
        pageNumber,
        pageSize,
      )
      .subscribe((response) => {
        this.students = response.students;
        this.totalRecords = response.totalRecords;
        this.loading = false;
      });
  }

  totalRecords: number = 10;
  pageSize: number = 5;
  pageNumber: number = 1;

  upsertStudent(event: {
    newStudent: Student;
    selectedFile: File | null;
    isEditMode: boolean;
  }): void {
    this.newStudent.name = this.newStudent.name.trim();
    if (event.isEditMode) {
      this.studentService
        .updateStudent(event.newStudent, event.selectedFile!)
        .subscribe(
          (response) => {
            this.loadPageOfStudents();

            this.sharedService.showToastMessage(
              'success',
              'Updated',
              'Student updated successfully!',
              3000
            );
          },
          (error) => {
            this.sharedService.showToastMessage(
              'error',
              'Error',
              'Failed to update student!',
              3000
            );
          }
        );
    } else {
      this.studentService
        .addStudent(event.newStudent, event.selectedFile!)
        .subscribe(
          (response) => {
            this.loadPageOfStudents();
            this.sharedService.showToastMessage(
              'success',
              'Student Added',
              `Student '${response.name}' added successfully!`,
              3000
            );
          },
          (error) => {
            this.sharedService.showToastMessage(
              'error',
              'Error Adding Student',
              'Failed to add student. Please try again.',
              3000
            );
          }
        );
    }

    this.resetFileInput();
  }

  hideDialog() {
    this.displayDialog = false;
    this.resetFileInput();
  }

  getFlagImageUrl(countryName: string): string {
    return (
      countryFlagUrls[countryName] ||
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/No_flag.svg'
    );
  }
}
