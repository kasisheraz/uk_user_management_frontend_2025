import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  createdAt?: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api';
  private readonly AUTH_URL = '/auth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check if user is already logged in
    if (this.getToken()) {
      this.loadCurrentUser();
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password),
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>('/login', {}, { headers }).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          this.isLoggedInSubject.next(true);
          this.loadCurrentUser();
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.AUTH_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  private loadCurrentUser(): void {
    if (this.getToken()) {
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.some(role => role.name === 'ADMIN') || false;
  }

  hasRole(roleName: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.some(role => role.name === roleName) || false;
  }
}