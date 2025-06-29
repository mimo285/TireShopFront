import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css', '../assets/css/LineIcons.3.0.css', '../assets/css/glightbox.min.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  cartSubtotal: number = 0;
  shippingCost: number = 0;
  totalAmount: number = 0;

  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  phoneNumber: string = '';
  deliveryAddress: string = '';
  city: string = '';
  postCode: string = '';

  isFormValid: boolean = true;
  formErrorMessage: string = '';
  formSubmitted!: boolean;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.cartService.getCart(userId).subscribe(
        (data) => {
          this.cartItems = data;
          this.cartItems.forEach((item) => {
            item.quantity = item.quantity || 1;
          });
          this.calculateTotals();
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

  validateForm(): boolean {
    return !!(this.firstName && this.lastName && this.emailAddress && this.phoneNumber && this.deliveryAddress && this.city && this.postCode);
  }

  submitOrder(): void {
  this.formSubmitted = true;

  if (!this.validateForm()) {
    this.isFormValid = false;
    this.toastr.error('Fill out all required fields!', 'Validation Error');
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    this.toastr.error('User not logged in', 'Error');
    return;
  }

  const orderData = { 
    userId: userId,
    firstName: this.firstName,
    lastName: this.lastName,
    emailAddress: this.emailAddress,
    phoneNumber: this.phoneNumber,
    deliveryAddress: this.deliveryAddress,
    city: this.city,
    postCode: this.postCode
  };

  // First create order on your backend
  this.orderService.createOrder(orderData, this.cartItems).subscribe(
    (orderResponse) => {
      // On order creation success, prepare checkout request for Stripe session
      const cartItems = this.cartItems.map(item => ({
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      const checkoutRequest = {
        cartItems,
        // optionally add orderId or other info if needed
      };

      // Call your backend Stripe checkout session endpoint
      fetch('https://tireshopback.onrender.com/api/StripeCheckout/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutRequest)
      })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url;  // Redirect to Stripe checkout page
        } else {
          this.toastr.error('Failed to initiate payment session.', 'Payment Error');
        }
      })
      .catch(error => {
        console.error('Error creating Stripe Checkout session:', error);
        this.toastr.error('Could not start payment', 'Payment Error');
      });

    },
    (error) => {
      console.error('Error creating order:', error);
      this.toastr.error('Some of the items you are trying to order are out of stock! Please go back to your cart.', 'Items out of stock!');
    }
  );
}
}