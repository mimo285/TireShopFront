import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5110/api/Product'; 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  modifyProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchProducts(
    query: string,
    selectedCategories: number[],
    selectedBrands: number[],
    condition: string,
    page: number = 1,
    pageSize: number = 9,
    sortOption: string = ''
  ): Observable<any> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    selectedCategories.forEach((categoryId) => {
      params = params.append('categories', categoryId.toString());
    });

    selectedBrands.forEach((brandId) => {
      params = params.append('brands', brandId.toString());
    });

    if (condition) {
      params = params.set('condition', condition);
    }

    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    params = params.set('sortOption', sortOption);

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }


  searchProductsAdmin(
    query: string,
    selectedCategories: number[],
    selectedBrands: number[],
    condition: string,
    page: number = 1,
    pageSize: number = 9,
    sortOption: string = ''
  ): Observable<any> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    selectedCategories.forEach((categoryId) => {
      params = params.append('categories', categoryId.toString());
    });

    selectedBrands.forEach((brandId) => {
      params = params.append('brands', brandId.toString());
    });

    if (condition) {
      params = params.set('condition', condition);
    }

    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    params = params.set('sortOption', sortOption);

    return this.http.get<any>(`${this.apiUrl}/search-admin`, { params });
  }

  getProductsByNames(names: string[]): Observable<any[]> {
    let params = new HttpParams();
  
    names.forEach((name) => {
      params = params.append('names', name);
    });

    return this.http.get<any[]>(`${this.apiUrl}/get-products-by-names`, { params });
  }
  
  restoreProduct(productId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/restore/${productId}`, {});
  }

}
