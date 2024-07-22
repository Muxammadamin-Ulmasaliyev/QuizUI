import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css',
})
export class AccessDeniedComponent implements OnInit {
  routerLink: string = '';
  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeRouterLink();
  }

  initializeRouterLink() {
    this.role = this.authService.getUserRole();
    if (this.role === 'Admin' || this.role === 'SuperAdmin') {
      this.routerLink = '/admin/home/quizzes';
    } else if (this.role === 'User') {
      this.routerLink = '/user/home/quizzes';
    } else {
      this.routerLink = '/login';
    }
  }
}
