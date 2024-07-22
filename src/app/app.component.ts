import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  
  constructor(private router: Router) {}
  links: MenuItem[] | undefined;
  ngOnInit() {
    this.links = [
      // { label: 'Students', icon: 'pi pi-users', route: '/students-list' },
      { label: 'login', icon: 'pi pi-sign-in', route: '/login' },
      { label: 'register', icon: 'pi pi-address-book', route: '/register' },
      { label: 'error', icon: 'pi pi-exclamation-circle', route: '/error' },
      { label: 'access-denied', icon: 'pi pi-unlock', route: '/access-denied' },
      { label: 'not found', icon: 'pi pi-user-minus', route: '/not-found' },
      { label: 'mail', icon: 'pi pi-user-minus', route: '/email-confirmation' },

    ];
  }
}
