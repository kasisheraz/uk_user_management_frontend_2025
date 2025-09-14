import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
selector: 'app-login',
template: `
<div class="login-container">
<mat-card class="login-card">
<mat-card-header>
<mat-card-title>
<mat-icon>login</mat-icon>
Login to Your Account
</mat-card-title>
</mat-card-header>

<mat-card-content>
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
<mat-form-field appearance="outline" class="full-width">
<mat-label>Username</mat-label>
<input matInput formControlName="username" placeholder="Enter your username">
<mat-icon matSuffix>person</mat-icon>
<mat-error *ngIf="loginForm.get('username')?.hasError('required')">
Username is required
</mat-error>
</mat-form-field>

<mat-form-field appearance="outline" class="full-width">
<mat-label>Password</mat-label>
<input matInput type="password" formControlName="password" placeholder="Enter your password">
<mat-icon matSuffix>lock</mat-icon>
<mat-error *ngIf="loginForm.get('password')?.hasError('required')">
Password is required
</mat-error>
</mat-form-field>

<div class="button-container">
<button mat-raised-button color="primary" type="submit"
[disabled]="loginForm.invalid || isLoading" class="full-width">
<mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
<span *ngIf="!isLoading">Login</span>
</button>
</div>
</form>
</mat-card-content>

<mat-card-actions>
<p class="register-link">
Don't have an account?
<a mat-button color="accent" routerLink="/register">Register here</a>
</p>
</mat-card-actions>
</mat-card>
</div>
`,
styles: [`
.login-container {
display: flex;
justify-content: center;
align-items: center;
min-height: calc(100vh - 120px);
      padding: 20px;
    }

    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
    }

    .login-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: center;
      justify-content: center;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .button-container {
      margin-top: 20px;
    }

    .register-link {
      text-align: center;
      margin: 0;
      padding: 16px;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Invalid username or password', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}