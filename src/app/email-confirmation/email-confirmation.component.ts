import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css',
})
export class EmailConfirmationComponent implements OnInit {
  test() {
    console.log(this.targetEmail);
    console.log(this.codeByUser);
  }
  ngOnInit() {
    this.sharedService.currentEmailData.subscribe((data) => {
      this.targetEmail = data;
    });

    console.log(this.targetEmail);
    
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private sharedService: SharedService
  ) {}

  codeByUser!: string;

  targetEmail!: string;

  confirmEmail() {
    this.authService.confirmEmail(this.targetEmail, this.codeByUser).subscribe(
      (response) => {
        // Handle successful confirmation
        this.sharedService.showToastMessage(
          'success',
          'Email confirmed!',
          'Confirmation successful',
          3000
        );

        // Redirect to students list
        this.router.navigate(['/user/home']);

        // Clear the input fields
        this.codeByUser = '';
        this.targetEmail = '';
      },
      (error) => {
        // Extract detailed error message if available
        let errorMessage = 'Confirmation failed';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        // Display error message
        this.sharedService.showToastMessage(
          'error',
          'Error!',
          errorMessage,
          3000
        );
      }
    );
  }
}
