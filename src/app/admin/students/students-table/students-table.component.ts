import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Student } from '../../../_models/Student';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Status } from '../../../_models/Status';
import { Teacher } from '../../../_models/Teacher';
import { countryFlagUrls } from '../../../_data/CountryFlagUrls';
import { SharedService } from '../../../_services/shared.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.css',
})
export class StudentsTableComponent implements OnInit {
  showEditStudentDialog(student: Student) {
    this.isEditMode = true;
    this.displayDialog = true;
    this.newStudent = student;

    const matchingTeacher = this.teachers.find(
      (teacher) => teacher.id === student.teacher.id
    );

    if (matchingTeacher) {
      this.newStudent.teacher = matchingTeacher;
    }

    this.dialogOpen.emit({
      isEditMode: this.isEditMode,
      newStudent: this.newStudent,
    });
  }

  showAddNewStudentDialog() {
    this.isEditMode = false;
    this.displayDialog = true;
    this.initializeNewStudent();
    this.dialogOpen.emit({
      isEditMode: this.isEditMode,
      newStudent: this.newStudent,
    });
  }
  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(400), // Adjust the debounce time as needed
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.sortTable.emit({
          sortField: this.sortField,
          sortOrder: this.sortOrder,
          isSortingEnabled: this.isSortingEnabled,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          searchValue : this.searchValue
        });
      });
  }
  initializeNewStudent() {
    this.newStudent = {
      name: '',
      country: '',
      teacher: { name: '' }, // Assuming Teacher has a name property
      date: new Date(), // Can be set to a default date if needed
      contract: 0, // Assuming contract is a number
      status: Status.QUALIFIED, // Assuming Status has a New value
    } as Student;
  }

  isSortingEnabled: boolean = false;

  sortField!: string | undefined | null | string[];
  sortOrder!: number | undefined | null;

  selectedStudents!: Student[];

  @Input() loading: boolean = false;
  @Input() students!: Student[];
  @Input() teachers!: Teacher[];

  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 5;
  @Input() pageNumber: number = 1;

  @Output() pageChanged = new EventEmitter<{
    sortField: string | undefined | null | string[];
    sortOrder: number | undefined | null;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue : string;
    
  }>();
  @Output() sortTable = new EventEmitter<{
    sortField: string | undefined | null | string[];
    sortOrder: number | undefined | null;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue : string ;
  }>();

  @Output() dialogOpen = new EventEmitter<{
    isEditMode: boolean;
    newStudent: Student;
  }>();
  @Output() deleteStudent = new EventEmitter<{
    studentIdsToDelete: number[];
  }>();

  isEditMode: boolean = false;

  newStudent: Student = {
    name: '',
    country: '',
    teacher: { name: '' },
    date: new Date(),
    contract: 0,
    status: Status.QUALIFIED,
  } as Student;


  searchValue: string = '';
  searchSubject: Subject<string> = new Subject();
  private destroy$ = new Subject<void>();
 

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: any) {
    this.searchSubject.next(event.target.value);
  }
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sharedService: SharedService

  ) {}

  showConfirmationDialogForDeletion() {
    const studentIds = this.selectedStudents.map((student) => student.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected students?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStudent.emit({ studentIdsToDelete: studentIds });
      },
    });
  }
  displayDialog: boolean = false;

  clearTableFilter(table: Table) {
    table.clear();
    this.searchValue = '';
    this.isSortingEnabled = false;
    this.sortTable.emit({
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      isSortingEnabled: this.isSortingEnabled,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchValue : this.searchValue
    });
  }
  getFlagImageUrl(countryName: string): string {
    return (
      countryFlagUrls[countryName] ||
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/No_flag.svg'
    );
  }
  getStudentImageUrl(imageName: string): string {
    // return `http://localhost:5229/api/Images?imageUrl=${imageName}`;
    return `https://localhost:7189/images/${imageName}`;

  }

  onSorted(event: TableLazyLoadEvent) {
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;

    this.isSortingEnabled = true;

    this.sortTable.emit({
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      isSortingEnabled: this.isSortingEnabled,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchValue : this.searchValue
    });
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1; // PrimeNG paginator uses 0-based index
    this.pageSize = event.rows;

    this.pageChanged.emit({
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      isSortingEnabled: this.isSortingEnabled,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchValue : this.searchValue

    });

    //this.loadPageOfStudents();
  }
  getStudentSeverity(
    studentStatus: Status
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (studentStatus) {
      case Status.QUALIFIED:
        return 'success';
      case Status.PROPOSAL:
        return 'warning';
      case Status.RENEWAL:
        return 'contrast';
      case Status.NEGOTIATION:
        return 'secondary';
      case Status.UNQUALIFIED:
        return 'danger';
      default:
        return undefined;
    }
  }

  getStudentStatusValue(
    studentStatus: Status
  ):
    | 'QUALIFIED'
    | 'PROPOSAL'
    | 'RENEWAL'
    | 'NEGOTIATION'
    | 'UNQUALIFIED'
    | undefined {
    switch (studentStatus) {
      case Status.QUALIFIED:
        return 'QUALIFIED';
      case Status.PROPOSAL:
        return 'PROPOSAL';
      case Status.RENEWAL:
        return 'RENEWAL';
      case Status.NEGOTIATION:
        return 'NEGOTIATION';
      case Status.UNQUALIFIED:
        return 'UNQUALIFIED';
      default:
        return undefined;
    }
  }

 
}
