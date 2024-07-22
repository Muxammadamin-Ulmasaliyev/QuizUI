import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/User';
import { AuthService } from '../../_services/auth.service';
import { ZenQuotesService } from '../../_services/zen-quotes-service.service';
import { QuoteModel } from '../../_models/QuoteModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private zenQuotesService: ZenQuotesService
  ) {}

  quoteModel: QuoteModel = { h: '', q: '', c: 0, a: '' };
  links: MenuItem[] | undefined;
  sidebarVisible: boolean = false;
  user: User = {
    id: '',
    userName: '',
    email: '',
    emailConfirmed: false,
    phoneNumber: '',
    password: '',
    roles: [],
    createdAt: new Date(),
  };

  handleClickProfileImage() {
    this.showSidebar();
  }
  logout() {
    this.authService.logout();
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(
      (user) => {
        this.user = user;
        localStorage.setItem('userId', user.id);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showSidebar() {
    this.sidebarVisible = true;
  }
  ngOnInit() {
    this.getCurrentUser();

    this.zenQuotesService.getQuotes().subscribe({
      next: (response) => {
        const randomIndex = Math.floor(Math.random() * response.length);

        this.quoteModel = response[randomIndex];
      },
      error: (httpErrorResponse) => {
        console.log(httpErrorResponse);
      },
    });
    this.links = [
      {
        label: 'Quizzes',
        icon: 'pi pi-check-circle',
        command: () => {
          this.router.navigate(['/user/home/quizzes']);
        },
        routerLink: ['/user/home/quizzes'],
      },
      {
        label: 'History',
        icon: 'pi pi-history',
        command: () => {
          this.router.navigate(['/user/home/history']);
        },
        routerLink: ['/user/home/history'],
      },
      {
        label: 'Scoreboard',
        icon: 'pi pi-trophy',
        command: () => {
          this.router.navigate(['/user/home/scoreboard']);
        },
        routerLink: ['/user/home/scoreboard'],
      },
    ];

    if (this.authService.isAdmin() && this.authService.isAuthenticated()) {
      this.links.push({
        label: 'Admin module',
        icon: 'pi pi-id-card',
        command: () => {
          this.router.navigate(['/admin/home/quizzes']);
        },
        routerLink: ['/admin/home/quizzes'],
      });
    }
  }
}
