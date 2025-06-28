import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from '../item/item.component';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ItemComponent, SearchbarComponent, ToastrModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  Math = Math;
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  condition: string ='';
  selectedCategories: number[] = [];
  selectedBrands: number[] = [];
  selectedCondition: string = ''; 
  sortOption: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  isLoading: boolean = true;
  searchQuery: string = '';
  totalProductCount: number = 0;

  constructor(private productService: ProductService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCategoriesAndBrands();
    this.loadProducts();
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applySearchAndFilters(); 
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    const query = this.searchQuery;
    const page = this.currentPage;
    const pageSize = this.itemsPerPage;
    const sortOption = this.sortOption;
    const condition = this.selectedCondition;

    this.productService.searchProducts(
      query,
      this.selectedCategories,
      this.selectedBrands,
      condition,
      page,
      pageSize,
      sortOption               
    ).subscribe({
      next: (data) => {
        this.products = data.items;
        this.totalProductCount = data.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      },
    });
  }  

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  loadCategoriesAndBrands(): void {
    this.isLoading = true;
  
    this.productService.getProducts().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.categories = Array.from(
            new Map(data.map((product: any) => [product.categoryId, { id: product.categoryId, name: product.category?.name }])).values()
          );
 
          this.brands = Array.from(
            new Map(data.map((product: any) => [product.brandId, { id: product.brandId, name: product.brand?.brandName }])).values()
          );
        } else {
          console.error('Expected an array of products, but received something else:', data);
        }
  
        console.log('Categories:', this.categories);
        console.log('Brands:', this.brands);
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories and brands:', err);
        this.isLoading = false;
      }
    });
  }
  
  

  applySearchAndFilters(): void {
    let tempFiltered = [...this.products];

    if (this.searchQuery.trim()) {
      tempFiltered = tempFiltered.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCategories.length > 0) {
      tempFiltered = tempFiltered.filter((product) =>
        this.selectedCategories.includes(product.categoryId)
      );
    }

    if (this.selectedBrands.length > 0) {
      tempFiltered = tempFiltered.filter((product) =>
        this.selectedBrands.includes(product.brandId)
      );
    }

    if (this.selectedCondition) {
      tempFiltered = tempFiltered.filter((product) => this.condition = this.selectedCondition);
    }

    this.currentPage = 1;
  }
  
  resetFilters(): void {
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedCondition = '';
    this.searchQuery = '';
  
    this.applySearchAndFilters();
    this.loadProducts();
  }

  onCategoryFilterChange(categoryId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    if (isChecked) {
      if (!this.selectedCategories.includes(categoryId)) {
        this.selectedCategories.push(categoryId);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter((id) => id !== categoryId);
    }

    this.applySearchAndFilters();
    this.loadProducts();
  }

  onBrandFilterChange(brandId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    if (isChecked) {
      if (!this.selectedBrands.includes(brandId)) {
        this.selectedBrands.push(brandId);
      }
    } else {
      this.selectedBrands = this.selectedBrands.filter((id) => id !== brandId);
    }
    console.log('Selected brands:', this.selectedBrands);

    this.applySearchAndFilters();
    this.loadProducts();
  }

  onConditionFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    const conditionValue = input.value;
  
    if (isChecked) {
      this.selectedCondition = conditionValue;  
    } else {
      this.selectedCondition = '';  
    }
  
    this.applySearchAndFilters();
    this.loadProducts();
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const sortValue = selectElement.value;
 
    this.sortOption = sortValue;
    console.log('Sort option changed to:', this.sortOption);
    this.applySearchAndFilters();
    this.loadProducts();
  }

  getPaginatedProducts(): any[] {
    return [...this.products];
  }
  

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
  
  totalPages(): number {
    return Math.ceil(this.totalProductCount / this.itemsPerPage);
  }
}
