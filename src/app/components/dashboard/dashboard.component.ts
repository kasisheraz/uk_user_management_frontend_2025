import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
selector: 'app-dashboard',
template: `
<div class="dashboard-container">
<div class="welcome-section">
<mat-card class="welcome-card">
<mat-card-header>
<mat-card-title>
<mat-icon>dashboard</mat-icon>
Welcome Back!
</mat-card-title>
</mat-card-header>
<mat-card-content>
<div *ngIf="currentUser$ | async as user" class="user-welcome">
<h2>Hello, {{user.firstName || user.username}}! 👋</h2>
<p>Welcome to your dashboard. Here's what you can do:</p>
</div>
</mat-card-content>
</mat-card>
</div>

<div class="actions-grid">
<mat-card class="action-card" routerLink="/profile">
<mat-card-header>
<mat-icon mat-card-avatar>account_circle</mat-icon>
<mat-card-title>My Profile</mat-card-title>
<mat-card-subtitle>View and edit your profile information</mat-card-subtitle>
</mat-card-header>
<mat-card-content>
<p>Update your personal information, change password, and manage your account settings.</p>
</mat-card-content>
<mat-card-actions>
<button mat-button color="primary">
<mat-icon>arrow_forward</mat-icon>
Go to Profile
</button>
</mat-card-actions>
</mat-card>

<mat-card *ngIf="(currentUser$ | async)?.roles | hasRole:'ADMIN'"
class="action-card admin-card" routerLink="/users">
<mat-card-header>
<mat-icon mat-card-avatar>group</mat-icon>
<mat-card-title>User Management</mat-card-title>
<mat-card-subtitle>Manage system users (Admin only)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>View all users, manage roles, and perform administrative tasks.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>arrow_forward</mat-icon>
              Manage Users
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="action-card info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>info</mat-icon>
            <mat-card-title>Account Information</mat-card-title>
            <mat-card-subtitle>Your current account details</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content *ngIf="currentUser$ | async as user">
            <div class="info-item">
              <strong>Username:</strong> {{user.username}}
            </div>
            <div class="info-item">
              <strong>Email:</strong> {{user.email}}
            </div>
            <div class="info-item">
              <strong>Roles:</strong>
              <mat-chip-set>
                <mat-chip *ngFor="let role of user.roles"
                         [color]="role.name === 'ADMIN' ? 'warn' : 'primary'"
                         selected>
                  {{role.name}}
                </mat-chip>
              </mat-chip-set>
            </div>
            <div class="info-item" *ngIf="user.createdAt">
              <strong>Member since:</strong> {{user.createdAt | date:'mediumDate'}}
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>trending_up</mat-icon>
            <mat-card-title>Quick Stats</mat-card-title>
            <mat-card-subtitle>Your account status</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">✅</div>
                <div class="stat-label">Account Active</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">🔐</div>
                <div class="stat-label">Secure Login</div>
              </div>
              <div class="stat-item" *ngIf="(currentUser$ | async)?.roles | hasRole:'ADMIN'">
                <div class="stat-value">👑</div>
                <div class="stat-label">Admin Access</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .welcome-section {
      margin-bottom: 30px;
    }

    .welcome-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .welcome-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .user-welcome h2 {
      margin: 0 0 10px 0;
      font-size: 1.8em;
    }

    .user-welcome p {
      margin: 0;
      opacity: 0.9;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .action-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .admin-card {
      border-left: 4px solid #f44336;
    }

    .info-card {
      border-left: 4px solid #2196f3;
    }

    .stats-card {
      border-left: 4px solid #4caf50;
    }

    .info-item {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-item strong {
      min-width: 80px;
    }

    .stats-grid {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .stat-value {
      font-size: 2em;
    }

    .stat-label {
      font-size: 0.9em;
      color: #666;
      font-weight: 500;
    }

    mat-chip-set {
      margin-left: 8px;
    }

    mat-icon[mat-card-avatar] {
      background-color: transparent;
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}
}