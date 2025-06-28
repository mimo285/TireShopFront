import { Component, OnInit } from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ItemComponent, CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit{
    
    products: any[] = [];
  
    constructor(private productService: ProductService) {}
  
    ngOnInit() {
      this.productService.getProducts().subscribe((data) => {
        this.products = data.map((product: { name: any; imageUrl:any; category: any; productId:any }) => ({
          ...product,
          image: product.imageUrl,                 
          category: product.category.name,          
          title: product.name,
          id: product.productId,                                                  
        }));
      });
    }
    
  
}
