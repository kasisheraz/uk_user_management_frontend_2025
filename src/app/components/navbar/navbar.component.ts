import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary" class="navbar">
      <span class="navbar-brand">
        <mat-icon>people</mat-icon>
        User Management
      </span>
      
      <span class="spacer"></span>
      
      <ng-container *ngIf="isLoggedIn$ | async; else loginButtons">
        <button mat-button routerLink="/dashboard" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </button>
        
        <button mat-button routerLink="/profile" routerLinkActive="active">
          <mat-icon>account_circle</mat-icon>
          Profile
        </button>
        
        <button *ngIf="isAdmin" 
                mat-button routerLink="/users" routerLinkActive="active">
          <mat-icon>group</mat-icon>
          Users
        </button>
        
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        
        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <p><strong>{{(currentUser$ | async)?.username}}</strong></p>
            <p class="user-email">{{(currentUser$ | async)?.email}}</p>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/profile">
            <mat-icon>settings</mat-icon>
            Settings
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      </ng-container>
      
      <ng-template #loginButtons>
        <button mat-button routerLink="/login">Login</button>
        <button mat-raised-button color="accent" routerLink="/register">Register</button>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2em;
      font-weight: 500;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .user-info {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .user-info p {
      margin: 0;
      font-size: 14px;
    }
    
    .user-email {
      color: #666;
      font-size: 12px !important;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;
  isAdmin = false;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}