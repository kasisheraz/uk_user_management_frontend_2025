import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// Update the path below to the correct location of user.service.ts
// Update the path below to the correct location of user.service.ts
// Update the path below to the correct location of user.service.ts
import { User, UserService } from '../../services/user.service'; // <-- Change this path if needed
@Component({
selector: 'app-user-list',

template: `
<div class="user-list-container">
<mat-card class="user-list-card">
<mat-card-header>
<mat-card-title>
<mat-icon>group</mat-icon>
User Management
</mat-card-title>
<mat-card-subtitle>
Manage all system users (Admin access required)
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container">
            <div *ngIf="isLoading" class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Loading users...</p>
            </div>

            <table *ngIf="!isLoading && users.length > 0" mat-table [dataSource]="users" class="user-table">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let user">{{user.id}}</td>
              </ng-container>

              <!-- Username Column -->
              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef>Username</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <mat-icon>account_circle</mat-icon>
                    <span>{{user.username}}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Full Name</th>
                <td mat-cell *matCellDef="let user">
                  {{(user.firstName || '') + ' ' + (user.lastName || '')}}
                  <span *ngIf="!user.firstName && !user.lastName" class="no-data">-</span>
                </td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">
                  <div class="email-info">
                    <mat-icon>email</mat-icon>
                    <span>{{user.email}}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Roles Column -->
              <ng-container matColumnDef="roles">
                <th mat-header-cell *matHeaderCellDef>Roles</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip-set *ngIf="user.roles && user.roles.length > 0">
                    <mat-chip *ngFor="let role of user.roles"
                             [color]="getRoleColor(role.name)"
                             selected>
                      {{role.name}}
                    </mat-chip>
                  </mat-chip-set>
                  <span *ngIf="!user.roles || user.roles.length === 0" class="no-data">No roles</span>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <div class="status-badge">
                    <mat-icon [color]="user.enabled ? 'primary' : 'warn'">
                      {{user.enabled ? 'check_circle' : 'cancel'}}
                    </mat-icon>
                    <span [class.active]="user.enabled" [class.inactive]="!user.enabled">
                      {{user.enabled ? 'Active' : 'Inactive'}}
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Created</th>
                <td mat-cell *matCellDef="let user">
                  {{user.createdAt | date:'shortDate'}}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <div class="action-buttons">
                    <button mat-icon-button
                            color="primary"
                            (click)="editUser(user)"
                            matTooltip="Edit User">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button
                            color="warn"
                            (click)="deleteUser(user)"
                            matTooltip="Delete User"
                            [disabled]="user.username === 'admin'">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="!isLoading && users.length === 0" class="no-users">
              <mat-icon>group_off</mat-icon>
              <p>No users found</p>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="refreshUsers()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .user-list-card {
      padding: 20px;
    }

    .user-list-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-container {
      margin: 20px 0;
      overflow-x: auto;
    }

    .user-table {
      width: 100%;
      background: white;
    }

    .user-info,
    .email-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-info mat-icon,
    .email-info mat-icon {
      color: #666;
      font-size: 18px;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .active {
      color: #4caf50;
      font-weight: 500;
    }

    .inactive {
      color: #f44336;
      font-weight: 500;
    }

    .no-data {
      color: #999;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .loading-container,
    .no-users {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      gap: 16px;
      text-align: center;
    }

    .no-users mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
    }

    .no-users p {
      color: #666;
      font-size: 16px;
      margin: 0;
    }

    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .table-container {
        font-size: 14px;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  displayedColumns: string[] = [
    'id', 'username', 'name', 'email', 'roles', 'status', 'createdAt', 'actions'
  ];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load users', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  refreshUsers(): void {
    this.loadUsers();
    this.snackBar.open('Users refreshed', 'Close', {
      duration: 2000
    });
  }

  getRoleColor(roleName: string): string {
    switch (roleName) {
      case 'ADMIN':
        return 'warn';
      case 'MODERATOR':
        return 'accent';
      default:
        return 'primary';
    }
  }

  editUser(user: User): void {
    // TODO: Implement edit user dialog
    this.snackBar.open('Edit user functionality coming soon!', 'Close', {
      duration: 3000
    });
  }

  deleteUser(user: User): void {
    if (user.username === 'admin') {
      this.snackBar.open('Cannot delete admin user', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const confirmation = confirm(`Are you sure you want to delete user "${user.username}"?`);
    if (confirmation && user.id) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadUsers(); // Refresh the list
        },
        error: (error: unknown) => {
          this.snackBar.open('Failed to delete user', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}