import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  SocialAuthService,
  SocialUser,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

interface JwtPayload {
  isAdmin?: string | boolean;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  user: SocialUser | null = null;

  constructor(public socialAuthService: SocialAuthService) {
    // Listen for authState but don't auto login here
    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
      // Don't call login() here to avoid automatic login on page load
    });
  }

  // Call this when user explicitly logs in
  login(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.socialAuthService.signOut(); // also logs out from Google
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return false;
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (typeof decoded.isAdmin === 'string') {
        return decoded.isAdmin.toLowerCase() === 'true';
      }
      return decoded.isAdmin === true;
    } catch {
      return false;
    }
  }

  // Initiates Google login popup
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, { prompt: 'select_account' });
  }
}