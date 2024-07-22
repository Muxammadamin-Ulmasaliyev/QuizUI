import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../_services/user.service';
import { User } from '../../../_models/User';
import { SharedService } from '../../../_services/shared.service';
import { share } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
})
export class UsersPageComponent implements OnInit {
  handleStatisticsDropDownChange(year: number) {
    this.selectedYear = year;
    this.loadChartData();
  }

  handleUserDeletion(userIdsToDelete: string[]) {
    this.userService.deleteUsers(userIdsToDelete).subscribe(
      (response) => {
        this.loadPageOfUsers();
        this.sharedService.showToastMessage(
          'success',
          'Successful',
          'Users deleted!',
          3000
        );
        this.selectedUsers = [];
      },
      (error) => {
        this.sharedService.showToastMessage(
          'error',
          'Error',
          'Failed to Delete Users!',
          3000
        );
      }
    );
  }

  handleDialogOpen(event: User) {
    this.newUser = event;
    this.displayDialog = true;
  }

  handleTableSorting(event: {
    sortField: string | string[] | null | undefined;
    sortOrder: number | null | undefined;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue: string;
  }) {
    this.loadPageOfUsers(
      event.searchValue,
      event.sortField,
      event.sortOrder,
      event.pageNumber,
      event.pageSize
    );
  }

  handlePageChange(event: {
    sortField: string | string[] | null | undefined;
    sortOrder: number | null | undefined;
    isSortingEnabled: boolean;
    pageNumber: number;
    pageSize: number;
    searchValue: string;
  }) {
    this.loadPageOfUsers(
      event.searchValue,
      event.sortField,
      event.sortOrder,
      event.pageNumber,
      event.pageSize
    );
  }

  onHideDialog() {
    this.displayDialog = false;
  }

  availableYears: number[] = [];
  selectedYear: number = new Date().getFullYear();
  chartData: number[] = [];

  users!: User[];

  selectedUsers!: User[];

  displayDialog: boolean = false;

  newUser: User = {
    id: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roles: [],
    emailConfirmed: false,
    createdAt: new Date(),
  } as User;

  constructor(
    private sharedService: SharedService,
    private userService: UserService
  ) {}

  loadChartData() {
    this.userService.getChartData(this.selectedYear).subscribe({
      next: (response) => {
        this.chartData = response.chartData;
        this.availableYears = response.availableYears;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  ngOnInit() {
    this.loadChartData();
  }

  loadPageOfUsers(
    searchValue: string = '',
    sortField?: string | string[] | null | undefined,
    sortOrder?: number | null | undefined,
    pageNumber: number = this.pageNumber,
    pageSize: number = this.pageSize
  ) {
    this.userService
      .getSortedUsers(
        searchValue,
        sortField == undefined ? 'createdAt' : sortField.toString(),
        sortField == undefined ? -1 : sortOrder,
        pageNumber,
        pageSize
      )
      .subscribe(
        (response) => {
          this.users = response.users;
          this.totalRecords = response.totalRecords;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  totalRecords: number = 10;
  pageSize: number = 5;
  pageNumber: number = 1;

  upsertUser(newUser: User): void {
    this.userService.addUser(newUser).subscribe({
      next: (user) => {
        this.loadPageOfUsers();
        this.sharedService.showToastMessage(
          'success',
          'User added',
          `New ${newUser.userName} added successfully! `,
          3000
        );
      },
      error: (httpErrorResponse) => {
        this.sharedService.showToastMessage(
          'error',
          `${httpErrorResponse.error.status}`,
          `${httpErrorResponse.error.message} `,
          3000
        );
      },
    });
  }

  hideDialog() {
    this.displayDialog = false;
  }
}
