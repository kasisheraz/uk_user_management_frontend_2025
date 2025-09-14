import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
selector: 'app-profile',
template: `
<div class="profile-container">
<mat-card class="profile-card">
<mat-card-header>
<mat-card-title>
<mat-icon>account_circle</mat-icon>
My Profile
</mat-card-title>
<mat-card-subtitle>
Manage your account information
</mat-card-subtitle>
</mat-card-header>

<mat-card-content>
<div *ngIf="currentUser" class="profile-content">
<!-- Profile Info Section -->
<div class="profile-info-section">
<h3>Account Information</h3>
<div class="info-grid">
<div class="info-item">
<mat-icon>person</mat-icon>
<div>
<strong>Username:</strong>
<span>{{currentUser.username}}</span>
</div>
</div>

<div class="info-item">
<mat-icon>email</mat-icon>
<div>
<strong>Email:</strong>
<span>{{currentUser.email}}</span>
</div>
</div>

<div class="info-item" *ngIf="currentUser.createdAt">
<mat-icon>schedule</mat-icon>
<div>
<strong>Member Since:</strong>
<span>{{currentUser.createdAt | date:'fullDate'}}</span>
</div>
</div>

<div class="info-item" *ngIf="currentUser.roles && currentUser.roles.length > 0">
<mat-icon>security</mat-icon>
<div>
<strong>Roles:</strong>
<mat-chip-set>
<mat-chip *ngFor="let role of currentUser.roles"
[color]="role.name === 'ADMIN' ? 'warn' : 'primary'"
selected>
{{role.name}}
</mat-chip>
</mat-chip-set>
</div>
</div>
</div>
</div>

<mat-divider></mat-divider>

<!-- Edit Profile Section -->
<div class="edit-profile-section">
<h3>Edit Profile</h3>
<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
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
<mat-label>Email</mat-label>
<input matInput type="email" formControlName="email" placeholder="Enter your email">
<mat-icon matSuffix>email</mat-icon>
<mat-error *ngIf="profileForm.get('email')?.hasError('required')">
Email is required
</mat-error>
<mat-error *ngIf="profileForm.get('email')?.hasError('email')">
Please enter a valid email
</mat-error>
</mat-form-field>

<div class="button-container">
<button mat-raised-button color="primary" type="submit"
[disabled]="profileForm.invalid || !profileForm.dirty || isLoading">
<mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
<span *ngIf="!isLoading">Update Profile</span>
</button>

<button mat-button type="button" (click)="resetForm()"
[disabled]="!profileForm.dirty">
Reset Changes
</button>
</div>
</form>
</div>

<!-- Account Status -->
<mat-divider></mat-divider>

<div class="account-status-section">
<h3>Account Status</h3>
<div class="status-grid">
<div class="status-item">
<mat-icon [color]="currentUser.enabled ? 'primary' : 'warn'">
{{currentUser.enabled ? 'check_circle' : 'cancel'}}
</mat-icon>
<div>
<strong>Account Status:</strong>
<span [class.active]="currentUser.enabled" [class.inactive]="!currentUser.enabled">
{{currentUser.enabled ? 'Active' : 'Inactive'}}
</span>
</div>
</div>
</div>
</div>
</div>

<div *ngIf="!currentUser" class="loading-container">
<mat-spinner></mat-spinner>
<p>Loading profile...</p>
</div>
</mat-card-content>
</mat-card>
</div>
`,
styles: [`
.profile-container {
max-width: 800px;
margin: 0 auto;
padding: 20px;
}

.profile-card {
padding: 20px;
}

.profile-card mat-card-title {
display: flex;
align-items: center;
gap: 8px;
}

.profile-content > div {
margin-bottom: 30px;
}

.profile-content h3 {
margin-bottom: 20px;
color: #333;
font-weight: 500;
}

.info-grid {
display: flex;
flex-direction: column;
gap: 16px;
}

.info-item {
display: flex;
align-items: flex-start;
gap: 12px;
padding: 12px;
background-color: #f5f5f5;
border-radius: 8px;
}

.info-item mat-icon {
margin-top: 2px;
color: #666;
}

.info-item div {
display: flex;
flex-direction: column;
gap: 4px;
}

.info-item strong {
font-weight: 600;
color: #333;
}

.info-item span {
color: #666;
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
display: flex;
gap: 16px;
margin-top: 20px;
}

.status-grid {
display: flex;
flex-direction: column;
gap: 12px;
}

.status-item {
display: flex;
align-items: center;
gap: 12px;
padding: 12px;
background-color: #f5f5f5;
border-radius: 8px;
}

.status-item div {
display: flex;
flex-direction: column;
gap: 4px;
}

.active {