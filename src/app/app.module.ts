import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './_services/token.interceptor';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { RegisterComponent } from './register/register.component';

import { TabMenuModule } from 'primeng/tabmenu';
import { NotFoundComponent } from './not-found/not-found.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { UserRoutingModule } from './user/user-routing.module';
import { AdminModule } from './admin/admin.module';
import { InputOtpModule } from 'primeng/inputotp';
import { AuthGuardService } from './_services/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminGuardService } from './_services/admin-guard.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    AccessDeniedComponent,
    RegisterComponent,
    NotFoundComponent,
    EmailConfirmationComponent,
  ],
  imports: [
    InputOtpModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    DialogModule,
    CalendarModule,
    TagModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    MultiSelectModule,
    InputTextModule,
    DropdownModule,
    SliderModule,
    ProgressBarModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    AvatarModule,
    AvatarGroupModule,
    PaginatorModule,
    PasswordModule,
    CheckboxModule,
    TabMenuModule,
    AdminRoutingModule,
    UserRoutingModule,
    AdminModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: ['localhost:4200/api/auth/login'],
      },
    }),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    MessageService,
    ConfirmationService,
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AdminGuardService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
