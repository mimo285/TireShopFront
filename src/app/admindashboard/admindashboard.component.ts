import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {
  @ViewChild('addProductForm', { static: false }) addProductForm!: NgForm;
  @ViewChild('modifyProductForm', { static: false }) modifyProductForm!: NgForm;

  products: any[] = [];
  paginatedProducts: any[] = [];
  pages: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  searchQuery: string = '';
  isAddProductModalOpen = false;
  isModifyProductModalOpen = false;
  isDeleteProductModalOpen = false;
  newProduct = { name: '', price: '', description: '', colorId: 1, categoryId: 0, brandId: 0, imageUrl: '', shippingPrice: 0, condition: '', itemsSold: 0, stock: 0, isDeleted: false };
  currentProduct = { productId: '', imageUrl: '', name: '', price: '', categoryId: 0, stock: 0, description: '', brandId: 1, condition: '', itemsSold: 0, isDeleted: false, shippingPrice: 0, };
  formSubmitted!: boolean;
  totalProductCount: number = 0;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.searchProductsAdmin(this.searchQuery, [], [], '', this.currentPage, this.itemsPerPage).subscribe((products) => {
      this.products = products.items;
      this.totalProductCount = products.totalCount;
      this.updatePagination();
      this.updatePaginatedProducts();
    });
  }

  updatePagination() {
    const totalPages = Math.ceil(this.totalProductCount / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  updatePaginatedProducts() {
    this.paginatedProducts = this.products;
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
    this.getProducts();
  }

  updateItemsPerPage() {
    this.updatePagination();
    this.updatePaginatedProducts();
    this.getProducts();
  }

  onSearchChange() {
    this.searchQuery = this.searchQuery.trim();
    this.onSearch();
  }

  onSearch() {
    if (this.searchQuery) {
      this.productService.searchProducts(this.searchQuery, [], [], '', 1, this.itemsPerPage, '').subscribe((products) => {
        this.products = products.items;
        this.updatePagination();
        this.updatePaginatedProducts();
      });
    } else {
      this.getProducts();
    }
  }

  openAddProductDialog() {
    this.isAddProductModalOpen = true;
  }

  openModifyProductDialog(product: any) {
    this.currentProduct = { ...product };
    this.isModifyProductModalOpen = true;
  }

  openDeleteProductDialog(product: any) {
    this.currentProduct = { ...product };
    this.isDeleteProductModalOpen = true;
  }

  closeModal() {
    this.isAddProductModalOpen = false;
    this.isModifyProductModalOpen = false;
    this.isDeleteProductModalOpen = false;
  }

  validateForm(): boolean {
    return (
      !!(this.newProduct.name &&
      this.newProduct.price &&
      this.newProduct.description &&
      this.newProduct.categoryId &&
      this.newProduct.brandId &&
      this.newProduct.imageUrl &&
      this.newProduct.condition &&
      this.newProduct.stock)
    );
  }
  
  addProduct() {
    console.log("trying submission");
    this.formSubmitted = true;
    if (this.addProductForm.invalid) {
      this.toastr.error('Please fill all the required fields correctly!', 'Validation Error');
      return;
    }
  
    this.productService.addProduct(this.newProduct).subscribe(() => {
      this.getProducts();
      this.closeModal();
      this.toastr.success('Item successfully added!', 'Item added!');
    });
  }
  

  modifyProduct(productId: string) {
    this.formSubmitted = true;
    if (this.modifyProductForm.invalid) {
      this.toastr.error('Fill out all required fields!', 'Validation Error');
      return;
    }

    this.productService.modifyProduct(productId, this.currentProduct).subscribe({
      next: () => {
        this.getProducts();
        this.closeModal();
        this.toastr.success('Item successfully modified!', 'Item modified!');
      },
      error: (error) => {
        if (error.status === 500) {
          this.toastr.error('The product has been modified by another user. Please reload and try again.');
        } else {
          this.toastr.error('Something went wrong. Please try again.');
        }
      }
    });
  }

  restoreProduct(productId: string): void {
    this.productService.restoreProduct(productId).subscribe(
      (response) => {
        console.log('Restore response:', response);
        this.toastr.success('Product restored successfully!');
        this.getProducts();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error('Error restoring product');
        console.error(error);
      }
    );
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.getProducts();
      this.closeModal();
      this.toastr.success('Item successfully deleted!', 'Item deleted!');
    });
  }

















  categories = [
    { id: 1, name: 'Passenger Tires' },
    { id: 2, name: 'Truck Tires' },
    { id: 3, name: 'Performance Tires' },
    { id: 4, name: 'Winter Tires' },
    { id: 5, name: 'All-Season Tires' }
  ];

  brands = [
    { id: 1, name: 'Michelin' },
    { id: 2, name: 'Bridgestone' },
    { id: 3, name: 'Goodyear' },
    { id: 4, name: 'Pirelli' },
    { id: 5, name: 'Continental' },
    { id: 6, name: 'Hankook' },
    { id: 7, name: 'Yokohama' },
    { id: 8, name: 'Dunlop' },
    { id: 9, name: 'Toyo' },
    { id: 10, name: 'Nexen' }
  ];

  conditions = [
    { value: 'New', name: 'New' },
    { value: 'Used', name: 'Used' }
  ];
}
