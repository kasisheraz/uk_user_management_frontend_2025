import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
selector: 'app-register',
template: `
<div class="register-container">
<mat-card class="register-card">
<mat-card-header>
<mat-card-title>
<mat-icon>person_add</mat-icon>
Create New Account
</mat-card-title>
</mat-card-header>

<mat-card-content>
<form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
<div class="form-row">
<mat-form-field appearance="outline" class="half-width">
<mat-label>First Name</mat-label>
<input matInput formControlName="firstName" placeholder="Enter first name">
<mat-icon matSuffix>person</mat-icon>
</mat-form-field>

<mat-form-field appearance="outline" class="half-width">
<mat-label>Last Name</mat-label>
<input matInput formControlName="lastName" placeholder="Enter last name">
<mat-icon matSuffix>person</mat-icon>
</mat-form-field>
</div>

<mat-form-field appearance="outline" class="full-width">
<mat-label>Username</mat-label>
<input matInput formControlName="username" placeholder="Choose a username">
<mat-icon matSuffix>account_circle</mat-icon>
<mat-error *ngIf="registerForm.get('username')?.hasError('required')">
Username is required
</mat-error>
<mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
Username must be at least 3 characters
</mat-error>
</mat-form-field>

<mat-form-field appearance="outline" class="full-width">
<mat-label>Email</mat-label>
<input matInput type="email" formControlName="email" placeholder="Enter your email">
<mat-icon matSuffix>email</mat-icon>
<mat-error *ngIf="registerForm.get('email')?.hasError('required')">
Email is required
</mat-error>
<mat-error *ngIf="registerForm.get('email')?.hasError('email')">
Please enter a valid email
</mat-error>
</mat-form-field>

<mat-form-field appearance="outline" class="full-width">
<mat-label>Password</mat-label>
<input matInput type="password" formControlName="password" placeholder="Choose a password">
<mat-icon matSuffix>lock</mat-icon>
<mat-error *ngIf="registerForm.get('password')?.hasError('required')">
Password is required
</mat-error>
<mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
Password must be at least 6 characters
</mat-error>
</mat-form-field>

<mat-form-field appearance="outline" class="full-width">
<mat-label>Confirm Password</mat-label>
<input matInput type="password" formControlName="confirmPassword" placeholder="Confirm your password">
<mat-icon matSuffix>lock</mat-icon>
<mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
Please confirm your password
</mat-error>
<mat-error *ngIf="registerForm.hasError('passwordMismatch')">
Passwords don't match
</mat-error>
</mat-form-field>

<div class="button-container">
<button mat-raised-button color="primary" type="submit"
[disabled]="registerForm.invalid || isLoading" class="full-width">
<mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
<span *ngIf="!isLoading">Create Account</span>
</button>
</div>
</form>
</mat-card-content>

<mat-card-actions>
<p class="login-link">
Already have an account?
<a mat-button color="accent" routerLink="/login">Login here</a>
</p>
</mat-card-actions>
</mat-card>
</div>
`,
styles: [`
.register-container {
display: flex;
justify-content: center;
align-items: center;
min-height: calc(100vh - 120px);
      padding: 20px;
    }

    .register-card {
      max-width: 500px;
      width: 100%;
      padding: 20px;
    }

    .register-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: center;
      justify-content: center;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 16px;
    }

    .button-container {
      margin-top: 20px;
    }

    .login-link {
      text-align: center;
      margin: 0;
      padding: 16px;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const formValue = this.registerForm.value;
      const registerData = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        firstName: formValue.firstName,
        lastName: formValue.lastName
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Registration successful! Please login.', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Registration failed. Please try again.';

          if (error.status === 400) {
            errorMessage = 'Username or email already exists.';
          }

          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}