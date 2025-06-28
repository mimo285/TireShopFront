import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnChanges {
  @Input() product: any;  
  @Output() updateCart = new EventEmitter<any>();  
  @Output() removeItem = new EventEmitter<string>(); 
  quantity!: number;  

  constructor(private cartService: CartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.quantity = this.product?.quantity || 1;
    }
  }

  removeFromCart(productId: string) {
    const userId = localStorage.getItem('userId');
    if (userId && productId) {
      const removeRequest = { userId, productId };
      this.cartService.removeFromCart(removeRequest).subscribe(
        (response) => {
          console.log('Item removed from cart:', response);
          this.removeItem.emit(productId);  
        },
        (error) => {
          console.error('Error removing item:', error);
        }
      );
    } else {
      console.error('User not logged in or invalid productId');
    }
  }

  getAvailableQuantities(): number[] {
    const stock = this.product?.stock || 0;
    return Array.from({ length: stock }, (_, i) => i + 1); 
  }

  updateQuantity(): void {
    if (this.quantity < 1) {
      this.quantity = 1;  
    }
  
    else if (this.quantity > this.product?.product.stock) {
      if (this.product?.product.stock === 0) {
        this.quantity = 1;  
      } else
      this.quantity = this.product?.product.stock;  
    }
  
    const updatedItem = { ...this.product, quantity: this.quantity };
  
    this.updateCart.emit(updatedItem);
  
    const userId = localStorage.getItem('userId');
    if (userId) {
      const updateRequest = {
        userId: userId,
        productId: this.product?.product.productId,
        quantity: this.quantity
      };
  
      this.cartService.updateCartItem(updateRequest).subscribe(
        (response) => {
          console.log('Cart item updated in database:', response);
        },
        (error) => {
          console.error('Error updating cart item in database:', error);
        }
      );
    }
  }
  
  
}
