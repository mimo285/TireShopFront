import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', '../assets/css/LineIcons.3.0.css', '../assets/css/glightbox.min.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  cartSubtotal: number = 0;
  shippingCost: number = 0; 
  totalAmount: number = 0;
  isCheckoutEnabled: boolean = false;

  constructor(private cartService: CartService, private toastr: ToastrService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.cartService.getCart(userId).subscribe(
        (data) => {
          console.log('Cart data:', data);
          this.cartItems = data;
          this.cartItems.forEach(item => {
            item.quantity = item.quantity || 1;  
          });
          this.calculateTotals();
          this.checkCartItems();
        },
        (error) => {
          console.error('Error fetching cart:', error);
        }
      );
    } else {
      console.error('User not logged in');
    }
  }

  calculateTotals(): void {
    this.cartSubtotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    
    this.shippingCost = 0; 
    this.totalAmount = this.cartSubtotal + this.shippingCost;
  }

  checkCartItems(): void {
    console.log('Checking cart items:', this.cartItems);
    const invalidItem = this.cartItems.some(item => item.product.stock < item.quantity || item.quantity === 0 || item.quantity < 1);
    console.log('Invalid item:', invalidItem);
    if (invalidItem) {
      console.error('Invalid cart item found');
      this.isCheckoutEnabled = false;
      this.toastr.error('Quantity cannot be zero or exceed stock', 'Invalid quantity');
    } else {
      this.isCheckoutEnabled = true;
    }
  }

  updateCartItem(updatedItem: any) {
    
    const itemIndex = this.cartItems.findIndex(item => item.product.productId === updatedItem.product.productId);
    if (itemIndex > -1) {
      this.cartItems[itemIndex].quantity = updatedItem.quantity;
      this.calculateTotals(); 
    }
    this.checkCartItems();

    const userId = localStorage.getItem('userId');
    if (userId) {
      const updateRequest = {
        userId: userId,
        productId: updatedItem.product.productId,
        quantity: updatedItem.quantity
      };
      this.cartService.updateCartItem(updateRequest).subscribe(
        (response) => {
          console.log('Cart updated:', response);
        },
        (error) => {
          console.error('Error updating cart:', error);
        }
      );
    }
  }

  removeCartItem(productId: string): void {
   
    this.cartItems = this.cartItems.filter(item => item.product.productId !== productId);
    this.calculateTotals(); 
  }
}

