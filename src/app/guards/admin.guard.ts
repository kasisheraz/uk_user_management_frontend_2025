import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user || !this.authService.isAdmin()) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}