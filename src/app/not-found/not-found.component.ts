import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  routerLink: string = '';
  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log(this.role);
    
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
