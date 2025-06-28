import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecommendationService } from '../services/recommendation.service';
import { ItemComponent } from '../item/item.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ItemComponent],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css', '../assets/css/LineIcons.3.0.css'],
})
export class ProductdetailsComponent implements OnInit {
  product: any;
  quantity: number = 1;
  totalPrice: number = 0;
  recommendedProducts: string[] = [];
  private routeSub: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.routeSub = this.route.params.subscribe(params => {
      const productId = params['id'];
    console.log('Product ID from route:', productId);  
    if (productId) {
      this.fetchProductDetails(productId);
    } else {
      console.error('Product ID is missing in the URL');
    }
  });
}

  fetchProductDetails(id: string): void {
    console.log('Fetching product details for productId:', id);
    this.productService.getProductById(id).subscribe(
      (data) => {
        this.product = data;
        console.log('Product details fetched:', this.product);  
        this.getRecommendations(this.product.name);
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  onQuantityChange(): void {
    console.log('Quantity changed to:', this.quantity); 
    if (this.quantity < 1) {
      this.quantity = 1;  
    }
    if (this.quantity > this.product?.stock) {
      this.quantity = this.product?.stock;  
    }
    this.totalPrice = this.product.price * this.quantity;
    console.log('Total price updated to:', this.totalPrice);  
  }

  addToCart(productId: string): void {
    const userId = localStorage.getItem('userId'); 
    console.log('User ID from localStorage:', userId);  
    if (!userId) {
      this.toastr.error('Please log in to add items to your cart!', 'Login required');
      return;
    }
  
    if (this.quantity < 1) {
      this.toastr.error('Quantity must be at least 1', 'Invalid quantity');
      return;
    }

    const cartItem = {
      userId: userId,  
      productId: productId,  
      quantity: this.quantity,   
    };
    
    console.log('Sending to backend:', cartItem);  
    this.cartService.addToCart(cartItem).subscribe(
      (response) => {
        console.log('Item added to cart successfully', response);  
        this.toastr.success('Item successfully added to cart!', 'Item added to cart!');
      },
      (error) => {
        console.error('Error adding item to cart:', error);  
        this.toastr.error('Failed to add item to cart', 'Error');
      }
    );
  }

  buyNow(productId: string): void {
    const userId = localStorage.getItem('userId'); 
    const quantity = 1;  

    if (!userId) {
      this.toastr.error('Please log in to add items to your cart!', 'Login required');
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
        this.router.navigate(['/checkout']).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error('Error adding item to cart:', error);
        this.toastr.error('Failed to add item to cart', 'Error');
      }
    );
  }

  splitDateTime(dateTime: string): { date: string, time: string } {
    const [date, time] = dateTime.split('T');
    return { date, time: time.split('.')[0] };
  }

  getRecommendations(productName: string): void {
    this.recommendationService.getRecommendations(productName).subscribe(
      (response) => {
        const recommendedNames = Array.isArray(response.response) 
          ? response.response 
          : response.response.split(',').map((name: string) => name.trim());
        console.log('Fetched recommendations:', recommendedNames);
        this.productService.getProductsByNames(recommendedNames).subscribe(
          (products) => {
            this.recommendedProducts = products;
            console.log('Fetched similar products:', this.recommendedProducts);
          },
          (error) => {
            console.error('Error fetching similar products:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
      }
    );
  }
  
  
  
}
