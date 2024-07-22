import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  onLogout() {
    this.authService.logout();
  }
  constructor(private router: Router, private authService: AuthService) {}
  links: MenuItem[] | undefined;
  ngOnInit() {

    this.links = [
      {
        label: 'Users',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['/admin/home/users']);
        },
        routerLink: ['/admin/home/users']
        
      },
      {
        label: 'Students',
        icon: 'pi pi-graduation-cap',
        command: () => {
          this.router.navigate(['/admin/home/students']);
        },
        routerLink: ['/admin/home/students']

      },
      {
        label: 'Quizzes',
        icon: 'pi pi-book',
        command: () => {
          this.router.navigate(['/admin/home/quizzes']);
        },
        routerLink: ['/admin/home/quizzes']

      },
      {
        label: 'Users module',
        icon: 'pi pi-arrow-circle-right',
        command: () => {
          this.router.navigate(['/user/home/quizzes']);
        },
        routerLink: ['/user/home/quizzes']

      },
    ];
  }
}
