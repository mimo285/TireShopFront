import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service'; 
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngAfterViewInit(): void {
    if ((window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: '16451055425-k42ku1i3r718ciqpkuuuf572tg65bupg.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  handleCredentialResponse(response: any) {
    const idToken = response.credential;

    this.userService.googleLogin(idToken).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('username', res.username);
        localStorage.setItem('isAdmin', res.isAdmin);
        localStorage.setItem('isLoggedIn', 'true');

        this.auth.login(res.token);
        this.router.navigate(['/']).then(() => window.location.reload());
      },
      error: (err) => {
        console.error('Google login backend failed:', err);
        this.errorMessage = 'Google login failed.';
        this.toastr.error(this.errorMessage, 'Login Error');
      }
    });
  }

  onLogin(): void {
    const user = {
      email: this.email,
      password: this.password
    };

    this.userService.login(user).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('username', response.username);
        localStorage.setItem('isAdmin', response.isAdmin);
        localStorage.setItem('isLoggedIn', 'true');

        this.router.navigate(['/']).then(() => window.location.reload());
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password';
        this.toastr.error(this.errorMessage, 'Login Error');
      }
    });
  }
}
