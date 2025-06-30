import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  isAdmin: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {}

  onRegister(): void {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.toastr.error(this.errorMessage, 'Invalid Email');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.toastr.error(this.errorMessage, 'Password Mismatch');
      return;
    }

    const user = {
      email: this.email,
      username: this.username,
      password: this.password,
      isAdmin: this.isAdmin,
    };

    this.userService.register(user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);

        this.loginAfterRegistration(user);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.toastr.error('User with this email already exists!', 'Registration failed');
      },
    });
  }

  private loginAfterRegistration(user: { email: string, password: string }) {
    this.userService.login(user).subscribe({
      next: (loginResponse) => {
        console.log('Login successful:', loginResponse);

        localStorage.setItem('userId', loginResponse.userId);
        localStorage.setItem('username', loginResponse.username);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', loginResponse.isAdmin);

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error: (loginError) => {
        console.error('Login failed after registration:', loginError);
        this.errorMessage = 'Login failed after registration. Please try again.';
      },
    });
  }
}
