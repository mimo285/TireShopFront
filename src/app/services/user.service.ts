import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5110/api/user'; 

  constructor(private http: HttpClient) {}

  register(user: { email: string; username: string; password: string; isAdmin: boolean }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error) => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }
  
  logout(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, { userId }).pipe(
      catchError((error) => {
        console.error('Logout error:', error);
        throw error;
      })
    );
  }

  googleLogin(idToken: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/google-login`, { Token: idToken }).pipe(
    catchError((error) => {
      console.error('Google login failed:', error);
      throw error;
    })
  );
}
}
