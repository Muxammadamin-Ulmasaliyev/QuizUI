import { Component } from '@angular/core';
import { LoginModel } from '../_models/LoginModel';
import { AuthService } from '../_services/auth.service';
import { SharedService } from '../_services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  onLogin() {
    this.authService.login(this.loginModel).subscribe({
      next: (response) => {
        let role: string | string[] = this.authService.getUserRole();

        if (role === 'Admin' || role === 'SuperAdmin' || role.includes("Admin")) {
          this.router.navigate(['/admin/home/quizzes']);
        } else if (role === 'User') {
          this.router.navigate(['/user/home/quizzes']);
        } else {
          this.router.navigate(['/access-denied']);
        }
      },
      error: (httpErrorResponse) => {
        console.log(httpErrorResponse);

        this.sharedService.showToastMessage(
          'error',
          `${httpErrorResponse.error.status}`,
          `${httpErrorResponse.error.message}`,
          3000
        );
      },
    });
  }

  valCheck: string[] = ['remember'];

  loginModel: LoginModel = { password: '', userName: '' };
}
