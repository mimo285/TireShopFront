import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';  // import your AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string = '';
  cartItemCount: number = 0;
  private cartItemCountSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.updateLoginStatus();
    this.loadCartItemCount();

    this.cartItemCountSubscription = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    this.cartItemCountSubscription.unsubscribe();
  }

  updateLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();

    if (this.isLoggedIn) {
      // Try to decode username from token, if available
      const token = this.authService.getToken();
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          this.username = decoded.username || '';
          console.log('Decoded username:', this.username);
        } catch {
          this.username = '';
        }
      }
    } else {
      this.username = '';
    }
  }

  loadCartItemCount(): void {
    if (!this.isLoggedIn) return;

    // Assuming user ID is stored in token or you have a method to get it
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.userId || decoded.sub;
      console.log('User ID:', userId);
      if (userId) {
        this.cartService.getCart(userId).subscribe({
          next: (cart) => {
            this.cartItemCount = cart.length;
          },
          error: (error) => {
            console.error('Error loading cart:', error);
          }
        });
      }
    } catch {
      console.error('Error decoding token for userId');
    }
  }

  logout(): void {
    this.authService.logout();
    this.updateLoginStatus();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
