import { Component } from '@angular/core';
import { UserRegisterModel } from '../_models/UserRegisterModel';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';
import { share } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
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
  containsUpperCase(): boolean {
    const regex = /[A-Z]/;
    return regex.test(this.registerModel.password);
  }

  containsLowerCase(): boolean {
    const regex = /[a-z]/;
    return regex.test(this.registerModel.password);
  }

  containsNonAlphanumeric(): boolean {
    const regex = /[^a-zA-Z0-9]/;
    return regex.test(this.registerModel.password);
  }

  containsNumeric(): boolean {
    const regex = /[0-9]/;
    return regex.test(this.registerModel.password);
  }

  isLengthGreaterThanEight(): boolean {
    return this.registerModel.password.length > 8;
  }

  onPasswordChange(): void {
    this.validatePassword();
  }

  checkIfEmailValid() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.registerModel.email)) {
      this.isEmailValid = true;
    } else {
      this.isEmailValid = false;
    }
  }

  checkIfUsernameValid(): void {
    if (
      this.isContainsNonAlphanumeric(this.registerModel.userName) ||
      this.registerModel.userName === ''
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
      this.registerModel.userName.trim() !== '' &&
      this.registerModel.email.trim() !== '' &&
      this.registerModel.password.trim() !== '' &&
      this.isPasswordContainsUpperCase &&
      this.isPasswordContainsLowerCase &&
      this.isPasswordContainsNonAlphanumeric &&
      this.isPasswordContainsNumeric &&
      this.isPasswordLengthValid &&
      this.isUsernameValid &&
      this.isEmailValid
    );
  }
  //#endregion


  registerModel: UserRegisterModel = {
    userName: '',
    email: '',
    password: '',
  };

  onRegister() {
    if (this.isModelStateValid()) {
      this.registerUser();
    }
  }

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  registerUser(): boolean {
    this.authService.register(this.registerModel).subscribe(
      (response) => {
        // Handle successful registration
        this.sharedService.showToastMessage(
          'success',
          'User registered successfully!',
          'Please, confirm your email, unique code is sent to your email',
          10000
        );

        console.log('Registration successful: ', response);
        this.sharedService.changeEmailData(this.registerModel.email);

        this.router.navigate(['/email-confirmation']);

        return true;
      },
      (error) => {
        // Handle registration error
        this.sharedService.showToastMessage(
          'error',
          `${error.status}`,
          `${error.message}`,
          3000
        );
        return false;
      }
    );
    return true;
  }
}
