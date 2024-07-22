import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from '../../../_models/User';
import { MessageService } from 'primeng/api';
import { SharedService } from '../../../_services/shared.service';
import { share } from 'rxjs';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css',
})
export class UserDialogComponent {


  isUser! : boolean;
  isAdmin! : boolean;

  test() {
    console.log("****************************************************");

    console.log(this.newUser);
    console.log("****************************************************");

  }
  onRoleChange(role: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.newUser.roles.includes(role)) {
        this.newUser.roles.push(role);
      }
    } else {
      const index = this.newUser.roles.indexOf(role);
      if (index > -1) {
        this.newUser.roles.splice(index, 1);
      }
    }
  }

  @Output() saveUser = new EventEmitter<User>();

  handleDialogHide() {
    this.onHideDialog.emit();
  }

  constructor(
    private messageService: MessageService,
    private sharedService: SharedService
  ) { }
  ngOnChanges(changes: SimpleChanges): void { }

  @Input() isEditMode!: boolean;
  @Input() displayDialog: boolean = false;
  @Input() newUser: User = {
    id : '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roles: [],
    emailConfirmed: false,
    createdAt: new Date(),
  } as User;

  onSaveUser(): void {
    this.newUser.emailConfirmed = true;
    this.saveUser.emit(this.newUser);

    console.log(this.newUser);
    this.handleDialogHide();
  }

  @Output() onHideDialog = new EventEmitter<void>();

















  //#region  VALIDATIONS

  eraseAllErrors() {
    this.isPasswordContainsUpperCase = true;
    this.isPasswordContainsLowerCase = true;
    this.isPasswordContainsNonAlphanumeric = true;
    this.isPasswordContainsNumeric = true;
    this.isPasswordLengthValid = true;
    this.isUsernameValid = true;
    this.isEmailValid = true;
  }

  isPasswordContainsUpperCase: boolean = true;
  isPasswordContainsLowerCase: boolean = true;
  isPasswordContainsNonAlphanumeric: boolean = true;
  isPasswordContainsNumeric: boolean = true;
  isPasswordLengthValid: boolean = true;
  isUsernameValid: boolean = true;
  isEmailValid: boolean = true;

  validatePassword(): void {
    this.isPasswordContainsUpperCase = this.containsUpperCase();
    this.isPasswordContainsLowerCase = this.containsLowerCase();
    this.isPasswordContainsNonAlphanumeric = this.containsNonAlphanumeric();
    this.isPasswordContainsNumeric = this.containsNumeric();
    this.isPasswordLengthValid = this.isLengthGreaterThanEight();
  }

  showErrorMessage(): void {
    let summary = 'error';
    let severity = 'danger';
    let detail = '';


    if (!this.isPasswordContainsLowerCase) {
      detail = "Password should contain at least one lower case";
    }

    if (!this.isPasswordContainsUpperCase) {
      detail = "Password should contain at least one upper case";
    }

    if (!this.isPasswordContainsNonAlphanumeric) {
      detail = "Password should contain at least one non alphanumeric character";
    }

    if (!this.isPasswordContainsNumeric) {
      detail = "Password should contain at least one numeric character";
    }

    if (!this.isPasswordLengthValid) {
      detail = "Password length should be at least 8 characters";
    }

    if (!this.isUsernameValid) {
      detail = "Username shouldt have non alphanumeric character";
    }
    if (!this.isEmailValid) {
      detail = "email should be in valid format";
    }



    this.sharedService.showToastMessage(severity, summary, detail, 7000);
  }
  containsUpperCase(): boolean {
    const regex = /[A-Z]/;
    return regex.test(this.newUser.password);
  }

  containsLowerCase(): boolean {
    const regex = /[a-z]/;
    return regex.test(this.newUser.password);
  }

  containsNonAlphanumeric(): boolean {
    const regex = /[^a-zA-Z0-9]/;
    return regex.test(this.newUser.password);
  }

  containsNumeric(): boolean {
    const regex = /[0-9]/;
    return regex.test(this.newUser.password);
  }

  isLengthGreaterThanEight(): boolean {
    return this.newUser.password.length > 8;
  }

  onPasswordChange(): void {
    this.validatePassword();
  }

  checkIfEmailValid() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.newUser.email)) {
      this.isEmailValid = true;
    } else {
      this.isEmailValid = false;
    }
  }

  checkIfUsernameValid(): void {
    if (
      this.isContainsNonAlphanumeric(this.newUser.userName) ||
      this.newUser.userName === ''
    )
      this.isUsernameValid = false;
    else this.isUsernameValid = true;
  }

  isContainsNonAlphanumeric(text: string): boolean {
    const regex = /[^a-zA-Z0-9]/;
    return regex.test(text);
  }

  isModelStateValid() {
    this.validatePassword();
    this.checkIfUsernameValid();
    this.checkIfEmailValid();

    return (
      this.newUser.userName.trim() !== '' &&
      this.newUser.email.trim() !== '' &&
      this.newUser.password.trim() !== '' &&
      this.isPasswordContainsUpperCase &&
      this.isPasswordContainsLowerCase &&
      this.isPasswordContainsNonAlphanumeric &&
      this.isPasswordContainsNumeric &&
      this.isPasswordLengthValid &&
      this.isUsernameValid &&
      this.isEmailValid &&
      this.newUser.phoneNumber &&
      this.newUser.roles
    );
  }
  //#endregion

  isCodeSendToEmail: boolean = false;
}
