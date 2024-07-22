import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../_models/User';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedService } from '../../../_services/shared.service';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
})
export class UsersTableComponent implements OnInit {
  getUserEmailConfirmedSeverity(
    emailConfirmed: boolean
  ): 'success' | 'danger' | undefined {
    return emailConfirmed ? 'success' : 'danger';
  }

  showAddNewUserDialog() {
    this.displayDialog = true;
    this.initializeNewUser();
    this.dialogOpen.emit(this.newUser);
  }
  initializeNewUser() {
    this.newUser = {
      id: '',
      userName: '',
      email: '',
      emailConfirmed: false,
      roles: [],
      password: '',
      phoneNumber: '',
      createdAt: new Date(),
    } as User;
  }

  searchValue: string = '';
  isSortingEnabled: boolean = false;

  sortField!: string | undefined | null | string[];
  sortOrder!: number | undefined | null;

  selectedUsers!: User[];

  @Input() loading: boolean = true;
  @Input() users!: User[];
  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 5;
  @Input() pageNumber: number = 1;

  @Output() pageChanged = new EventEmitter<{
    sortField: string | undefined | null | string[];
    sortOrder: number | undefined | null;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue: string;
  }>();
  @Output() sortTable = new EventEmitter<{
    sortField: string | undefined | null | string[];
    sortOrder: number | undefined | null;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue: string;
  }>();

  @Output() dialogOpen = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<string[]>();

  newUser: User = {
    id: '',
    userName: '',
    email: '',
    emailConfirmed: false,
    roles: [],
    password: '',
    phoneNumber: '',
    createdAt: new Date(),
  } as User;

  constructor(private confirmationService: ConfirmationService) {}
  ngOnInit(): void {
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
          searchValue: this.searchValue,
        });
      });
  }
  searchSubject: Subject<string> = new Subject();
  private destroy$ = new Subject<void>();
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: any) {
    this.searchSubject.next(event.target.value);
  }
  showConfirmationDialogForDeletion() {
    const userIds = this.selectedUsers.map((user) => user.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser.emit(userIds);
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
      searchValue: this.searchValue,
    });
  }

  onSorted(event: TableLazyLoadEvent) {
    this.isSortingEnabled = true;
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;
    this.isSortingEnabled = true;

    this.sortTable.emit({
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      isSortingEnabled: this.isSortingEnabled,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchValue: this.searchValue,
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
      searchValue: this.searchValue,
    });
  }
}
