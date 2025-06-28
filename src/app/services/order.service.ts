import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5110/api/order';  

  constructor(private http: HttpClient) {}

  createOrder(orderData: any, cartItems: any[]): Observable<any> {
    
    const orderPayload = {
      userId: orderData.userId,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      emailAddress: orderData.emailAddress,
      phoneNumber: orderData.phoneNumber,
      deliveryAddress: orderData.deliveryAddress,
      city: orderData.city,
      postCode: orderData.postCode,
      orderDetails: cartItems.map((item: any) => ({
        productId: item.product.productId,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity
      }))
    };

    return this.http.post(this.apiUrl, orderPayload);
  }

  getPurchaseHistory(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${userId}`);
  }
}
