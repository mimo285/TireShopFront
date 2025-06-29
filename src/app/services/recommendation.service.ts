import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private apiUrl = 'https://tireshopback.onrender.com/api/Recommendation/get-recommendation';

  constructor(private http: HttpClient) { }

  getRecommendations(product: string): Observable<any> {
    const params = new HttpParams().set('product', product);
    
    return this.http.get<any>(this.apiUrl, { params });
  }
}
