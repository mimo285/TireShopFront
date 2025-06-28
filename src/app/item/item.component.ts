import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() product: any;

  constructor(private cartService: CartService, private router: Router, private toastr: ToastrService) {}

  addToCart(productId: string): void {
    const userId = localStorage.getItem('userId'); 
    const quantity = 1;  

    if (!userId) {
      this.toastr.error('Please log in to add items to your cart!', 'Login required');
      return;
    }

    const cartItem = {
      userId: userId,  
      productId: productId,  
      quantity: quantity,   
    };

    console.log('Adding to cart:', cartItem);  

    this.cartService.addToCart(cartItem).subscribe(
      (response) => {
        console.log('Item added to cart successfully', response);
        this.toastr.success('Item successfully added to cart!', 'Item added to cart!');
      },
      (error) => {
        console.error('Error adding item to cart:', error);
        alert('Failed to add item to cart');
      }
    );
  }

  buyNow(productId: string): void {
    const userId = localStorage.getItem('userId'); 
    const quantity = 1;  

    if (!userId) {
      this.toastr.error('Please log in to add items to your cart!', 'Login required');
      return;
    }

    const cartItem = {
      userId: userId,  
      productId: productId,  
      quantity: quantity,   
    };

    console.log('Adding to cart:', cartItem);  // Log cartItem for debugging

    this.cartService.addToCart(cartItem).subscribe(
      (response) => {
        console.log('Item added to cart successfully', response);
        this.toastr.success('Item successfully added to cart!', 'Item added to cart!');
        this.router.navigate(['/checkout']).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error('Error adding item to cart:', error);
        alert('Failed to buy now');
      }
    );
  }
}
