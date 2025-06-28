import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5110/api/Cart';
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCountSubject.asObservable(); 

  constructor(private http: HttpClient) {}

  addToCart(cartItem: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, cartItem).pipe(
     
      tap(() => this.updateCartItemCount())
    );
  }

  getCart(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${userId}`);
  }

  removeFromCart(removeRequest: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove`, { body: removeRequest }).pipe(
      
      tap(() => this.updateCartItemCount())
    );
  }

  updateCartItem(cartItem: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, cartItem).pipe(
     
      tap(() => this.updateCartItemCount())
    );
  }

  private updateCartItemCount() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getCart(userId).subscribe(cart => {
       
        this.cartItemCountSubject.next(cart.length);
      });
    }
  }
}
