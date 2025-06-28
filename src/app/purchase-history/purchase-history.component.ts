import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service'; 
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css'],
})
export class PurchaseHistoryComponent implements OnInit {
  purchaseHistory$!: Observable<any>;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.purchaseHistory$ = this.orderService.getPurchaseHistory(userId); 
    } else {
      console.error('User ID not found in local storage');
    }
  }

  splitDateTime(dateTime: string): { date: string, time: string } {
    const [date, time] = dateTime.split('T');
    return { date, time: time.split('.')[0] };
  }
}
